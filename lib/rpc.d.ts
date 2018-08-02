import { Observable } from 'rxjs';
export declare const config: () => {
    api: string;
    header: {
        'Content-Type': string;
    };
};
export declare const rpc: (fn?: ((params: any) => any) | undefined) => (source: Observable<any>) => Observable<any>;
