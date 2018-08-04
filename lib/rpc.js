import { of } from 'rxjs';
import { map, filter, catchError, flatMap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
export const config = () => {
    return {
        api: 'https://zeronet.simplestaking.com:3000',
        //api: 'https://node2.simplestaking.com:3000',
        header: { 'Content-Type': 'application/json' }
    };
};
export const rpc = (fn) => (source) => source.pipe(
// exec calback function
map(state => (Object.assign({}, state, { rpc: fn(state) }))), 
// tap(state => console.log(' ')),
// tap(state => console.log('[rpc][url] : ', state.rpc.url)),
// tap(state => console.log('[rpc][path] : ', state.rpc.path)),
// tap(state => console.log('[rpc][payload] : ', state.rpc.payload)),
flatMap(state => state.rpc.payload !== undefined ?
    // post 
    ajax.post(config().api + state.rpc.url, state.rpc.payload, config().header).pipe(
    // without response do not run it
    filter(event => event.response), 
    // use only response
    map(event => (Object.assign({}, state, { [state.rpc.path]: event.response }))), 
    // catchError
    catchError(error => {
        console.warn('[rpc][ajax.post]', error);
        return of([error]);
    }))
    :
        // get 
        ajax.get(config().api + state.rpc.url, config().header).pipe(
        // without response do not run it
        filter(event => event.response), 
        // use only response
        map(event => (Object.assign({}, state, { [state.rpc.path]: event.response }))), 
        // catchError
        catchError(error => {
            console.warn('[rpc][ajax.get]', error);
            return of([error]);
        }))));
//# sourceMappingURL=rpc.js.map