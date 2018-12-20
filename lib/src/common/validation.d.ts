import { OperationMetadata } from "./operations";
/**
 * Check reveal operation metadata in runtime to prevent hidden failues
 */
export declare function validateRevealOperation(operation: OperationMetadata): void;
/**
 * Check transaction operation metadata in runtime to prevent hidden failues
 */
export declare function validateTransactionOperation(operation: OperationMetadata): void;
/**
 * Check origination operation metadata in runtime to prevent hidden failues
 */
export declare function validateOriginationOperation(operation: OperationMetadata): void;
