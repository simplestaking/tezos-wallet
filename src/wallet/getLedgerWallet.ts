import { State } from '../common';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import 'babel-polyfill';
import { LedgerState, LedgerUtils } from '../common/ledger';
// @ts-ignore
import Tezos from '@obsidiansystems/hw-app-xtz';


export const getLedgerWallet = <T extends State>() => (source: Observable<any>): Observable<T & State & LedgerState> => source.pipe(
  mergeMap(state =>
    from(new LedgerUtils().getAddress()).pipe(
      map(keyData => ({
        ...state,
        ledger: { keys: [keyData] }
      } as T & State)),
    )
  )
) as Observable<T & State & LedgerState>;

