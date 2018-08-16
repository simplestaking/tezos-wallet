import { Observable } from 'rxjs';
export declare const rpc: (fn: (params: any) => any) => (source: Observable<any>) => Observable<any>;
