import { of } from 'rxjs';
import { map, filter, catchError, flatMap, tap } from 'rxjs/operators';
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
map(state => fn ? (Object.assign({}, state, fn(state))) : state), tap(state => console.log(' ')), tap(state => console.log('[rpc][url] : ', state.url)), tap(state => console.log('[rpc][path] : ', state.path)), tap(state => console.log('[rpc][payload] : ', state.payload)), flatMap(state => state.payload !== undefined ?
    // post 
    ajax.post(config().api + state.url, state.payload, config().header).pipe(
    // without response do not run it
    filter(event => event.response), 
    // use only response
    map(event => (Object.assign({}, state, { [state.path]: event.response }))), 
    // catchError
    catchError(error => {
        console.warn('[rpc][ajax.post]', error);
        return of([error]);
    }))
    :
        // get 
        ajax.get(config().api + state.url, config().header).pipe(
        // without response do not run it
        filter(event => event.response), 
        // use only response
        map(event => (Object.assign({}, state, { [state.path]: event.response }))), 
        // catchError
        catchError(error => {
            console.warn('[rpc][ajax.get]', error);
            return of([error]);
        }))), tap(state => console.log('[rpc][response] : ', state)));
//# sourceMappingURL=rpc.js.map