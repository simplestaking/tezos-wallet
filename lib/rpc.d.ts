import { Observable } from 'rxjs';
import { RpcParams, StateWallet } from './src/types';
export declare const rpc: <T extends StateWallet>(selector: (params: T) => RpcParams) => (source: Observable<T>) => Observable<T>;
