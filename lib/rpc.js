import { of } from 'rxjs';
import { map, filter, catchError } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
export const config = () => {
    return {
        api: 'https://zeronet.simplestaking.com:3000',
        //api: 'https://node2.simplestaking.com:3000',
        header: { 'Content-Type': 'application/json' }
    };
};
export const rpc = (url, payload) => {
    return payload !== undefined ?
        ajax.post(config().api + url, payload, config().header).pipe(
        // if do not have response do not run it
        filter(event => event.response), 
        // use only response
        map(event => event.response), 
        // catchError
        catchError(error => {
            console.warn('[rpc][ajax.post]', error);
            return of([error]);
        }))
        :
            ajax.get(config().api + url, config().header).pipe(
            // if do not have response do not run it
            filter(event => event.response), 
            // use only response
            map(event => event.response), 
            // catchError
            catchError(error => {
                console.warn('[rpc][ajax.get]', error);
                return of([error]);
            }));
};
// export const rpc = (url: string, payload?: any) => <T>(source: Observable<T>): Observable<T> => source.pipe(
//     tap(state => console.log('[rpc]', state)),
//     flatMap(() => payload !== undefined ?
//         ajax.post(config().api + url, payload, config().header).pipe(
//             // if do not have response do not run it
//             filter(event => event.response),
//             // use only response
//             map(event => event.response)
//         )
//         :
//         ajax.get(config().api + url, config().header).pipe(
//             // if do not have response do not run it
//             filter(event => event.response),
//             // use only response
//             map(event => event.response)
//         )
//     )
// )
//# sourceMappingURL=rpc.js.map