import { OperationMetadata } from "../types";

export function validateRevealOperation(operation: OperationMetadata) {

    ['public_key'].forEach(
        prop => checkPropertyWithError(operation, prop, 'validateRevealOperation')
    )
}

export function validateTransactionOperation(operation: OperationMetadata) {

    ['amount', 'destination'].forEach(
        prop => checkPropertyWithError(operation, prop, 'validateTransactionOperation')
    )
}

export function validateOriginationOperation(operation: OperationMetadata) {

    ['manager_pubkey', 'balance', 'spendable', 'delegatable', 'delegate'].forEach(
        prop => checkPropertyWithError(operation, prop, 'validateOriginationOperation')
    );
}


function checkPropertyWithError(o: Object, prop: string, origin: string) {

    if (!o.hasOwnProperty(prop)) {
        const error = `[${origin}] Object is missing required property "${prop}".`;

        console.error(error)
        throw new TypeError(error);
    }
}