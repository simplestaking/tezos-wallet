import { State } from '../common';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import 'babel-polyfill';
import { LedgerState, LedgerUtils } from '../common/ledger';
import type Transport from '@ledgerhq/hw-transport';


export const getLedgerWallet = <T extends State>(selector: (params: State) => { transport: Transport | undefined }) => (source: Observable<any>): Observable<State> => source.pipe(
  switchMap(state => {
    const transportHolder = selector(state);
    return from(new LedgerUtils().getAddress(transportHolder)).pipe(
      map(ledgerState => ({
        ...state,
        ledger: ledgerState,
      } as T & State)),
    );
  }),
) as Observable<T & State & LedgerState>;
