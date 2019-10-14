import { OperationMetadata } from "./operations";

/**
 * Check reveal operation metadata in runtime to prevent hidden failues
 */
export function validateRevealOperation(operation: OperationMetadata) {

    ['public_key'].forEach(
        prop => checkPropertyWithError(operation, prop, 'validateRevealOperation')
    )
}

/**
 * Check transaction operation metadata in runtime to prevent hidden failues
 */
export function validateTransactionOperation(operation: OperationMetadata) {

    ['amount', 'destination'].forEach(
        prop => checkPropertyWithError(operation, prop, 'validateTransactionOperation')
    )
}


/**
 * Check origination operation metadata in runtime to prevent hidden failues
 */
export function validateOriginationOperation(operation: OperationMetadata) {

    ['balance', 'delegate'].forEach(
        prop => checkPropertyWithError(operation, prop, 'validateOriginationOperation')
    );
}


/**
 * Ensure that defined property exists in object and throw syntax error if not
 * @param o object to check
 * @param propName prop name
 * @param methodName user friendly method name for better error tracking
 */
function checkPropertyWithError(o: Object, propName: string, methodName: string) {

    if (!o.hasOwnProperty(propName)) {
        const error = `[${methodName}] Object is missing required property "${propName}".`;

        console.error(error)
        throw new SyntaxError(error);
    }
}