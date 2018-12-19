import { Observable, throwError } from 'rxjs';
import { map, filter, catchError, flatMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import { RpcParams, StateWallet } from '../types';


export const rpc = <T extends StateWallet>(selector: (params: T) => RpcParams) => (source: Observable<T>): Observable<T> =>
    source.pipe(

        //exec calback function
        map(state => ({
            ...state as any,
            rpc: selector(state)
        })),

        // tap(state => console.log('[rpc] state ', state)),
        // tap(state => console.log('[rpc][url] : ', state.rpc.url)),
        // tap(state => console.log('[rpc][path] : ', state.rpc.path)),
        // tap(state => console.log('[rpc][payload] : ', state.rpc.payload)),

        flatMap(state => {

            return state.rpc.payload !== undefined ?
                // post 
                ajax.post(state.wallet.node.url + state.rpc.url, state.rpc.payload, { 'Content-Type': 'application/json' }).pipe(
                    // without response do not run it
                    filter(event => event.response),
                    // use only response
                    map(event => (
                        { ...state, [state.rpc.path]: event.response }
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
                    filter(event => event.response),
                    // use only response
                    map(event => (
                        { ...state, [state.rpc.path]: event.response }
                    )),
                    // catchError
                    catchError(error => {
                        console.warn('[-] [rpc][ajax.get][request] url: ', error.request.url)
                        console.warn('[-] [rpc][ajax.get][response] error: ', error.status, error.response)
                        return throwError({ ...error, state })
                    })
                )
        }
        )
        // tap(state => console.log('[rpc][response] : ', state))
    )

