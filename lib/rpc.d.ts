import { Observable } from 'rxjs';
export declare const config: () => {
    api: string;
    header: {
        'Content-Type': string;
    };
};
export declare const rpc: (url: string, payload?: any) => Observable<any>;
