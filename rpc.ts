import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const config = {
    api: 'https://node.simplestaking.com:3000',
    header: { 'Content-Type': 'application/json' }
}

export const rpc = (url: string, payload?: any) => {

    return ajax.post(config.api + url, payload, config.header).pipe(
        // if do not have response do not run it
        filter(event => event.response),
        // use only response
        map(event => event.response)
    )

}

