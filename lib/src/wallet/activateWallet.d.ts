import { Observable } from "rxjs";
import { State, ActivateWallet } from "../common";
import { StateOperations } from "../operation";
export declare type StateActivateWallet = {
    activateWallet: ActivateWallet;
};
/**
  * Activate generated wallet address
  *
  * @operation activate_account
  */
export declare const activateWallet: <T extends State>(selector: (state: T) => ActivateWallet) => (source: Observable<T>) => Observable<T & StateActivateWallet & StateOperations & import("../src/head/getHead").StateHead & import("../src/contract/getContractCounter").StateCounter & import("../src/contract/getContractManagerKey").StateManagerKey & import("../src/operation/forgeOperation").StateOperation & State & import("../src/operation/signOperation").StateSignOperation & import("../src/operation/applyInjectOperation").StatePreapplyOperation & import("../src/operation/applyInjectOperation").StateInjectionOperation>;
