import { Observable } from 'rxjs';
export declare const config: () => {
    api: string;
    header: {
        'Content-Type': string;
    };
};
export declare const rpc: (fn: (params: any) => any) => (source: Observable<any>) => Observable<any>;
