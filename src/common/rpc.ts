import { Observable, throwError } from 'rxjs';
import { catchError, filter, flatMap, map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { State } from './state';

export interface RpcParams {
    path: string
    url: string
    payload?: any
}

/**
 * Remote procedure call (RPC) on tezos node
 * Returns state object with rpc result under property defined in rpc parameters
 *
 * @param selector method returning rpc parameters
 *
 * @throws RpcError
 */
export const rpc = <T extends State>(selector: (params: T) => RpcParams) => (source: Observable<T>): Observable<T> => source.pipe(

    //exec callback function
    map(state => ({
        ...state as State,
        rpc: selector(state)
    })),
    flatMap((state: State) => {
      if (!state.rpc.payload && state.ws && state.ws.webSocket && !state.ws.webSocket.closed) {
        const id = Math.floor(Math.random() * 1000000000000);
        const body = state.rpc.payload ? { params: { body: state.rpc.payload } } : undefined;
        state.ws.webSocket.next({
          jsonrpc: '2.0',
          method: state.rpc.url,
          id,
          ...body,
        });
        return state.ws.webSocket.asObservable().pipe(
          filter(response => response.id === id),
          map(response => ({
            ...state,
            [state.rpc.path]: response.result,
          } as T & State)),
        );
      }

        return state.rpc.payload !== undefined ?
            // post
            ajax.post(state.wallet.node.url + state.rpc.url, state.rpc.payload, { 'Content-Type': 'application/json' }).pipe(
                // without response do not run it
                // filter(event => event.response),
                // use only response
                map(event => (
                    { ...state, [state.rpc.path]: event.response } as T & State
                )),
                // catchError
                catchError(error => {
                    console.warn('[-] [rpc][ajax.post][request] url: ', error.request.url)
                    console.warn('[-] [rpc][ajax.post][request] body: ', error.request.body)
                    console.warn('[-] [rpc][ajax.post][response] error: ', error.status, error.response)
                    return throwError({ ...error, state })
                })
            )
            :
            // get
            ajax.get(state.wallet.node.url + state.rpc.url, { 'Content-Type': 'application/json' }).pipe(
                // without response do not run it
                // filter(event => event.response),
                // use only response
                map(event => (
                    { ...state, [state.rpc.path]: event.response } as T & State
                )),
                // catchError
                catchError(error => {
                    console.warn('[-] [rpc][ajax.get][request] url: ', error.request.url)
                    console.warn('[-] [rpc][ajax.get][response] error: ', error.status, error.response)
                    return throwError({ ...error, state })
                })
            )
    }),
    // tap(state => console.log('[rpc][response] : ', state))
);


