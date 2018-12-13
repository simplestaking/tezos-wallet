import { Observable } from 'rxjs';
import { RpcParams, StateWallet } from '../types';
export declare const rpc: <T extends StateWallet>(selector: (params: T) => RpcParams) => (source: Observable<T>) => Observable<T>;
