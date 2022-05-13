import 'babel-polyfill';
// @ts-ignore
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';
// @ts-ignore
import Tezos from '@obsidiansystems/hw-app-xtz';
import { OperationService } from './operation.service';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';

export class LedgerService {
  transport: any;
  private operationService: OperationService
  constructor() {
    this.operationService = new OperationService();
  }

  async setTransport() {
    if (!this.transport) {
      console.log('Trying to use NodeHID for transport...');
      try {
        this.transport = await TransportNodeHid.create();
        console.log('Transport is now set to use NodeHID!');
      } catch (e) {
        this.transport = null;
        console.warn('Couldn\'t set NodeHID as transport!');
        console.error(e);
      }
    }
    if (!this.transport) {
      console.log('Trying to use WebHID for transport...');
      try {
        this.transport = await TransportWebHID.create();
        console.log('Transport is now set to use WebHID!');
      } catch (e) {
        this.transport = null;
        console.warn('Couldn\'t set WebHID as transport!');
        console.error(e);
      }
    }
    if (!this.transport) {
      try {
        this.transport = await TransportU2F.create();
        console.warn('Transport is now set to use U2F!');
      } catch (e) {
        this.transport = null;
        console.log('Couldn\'t set U2F as transport!');
        console.error(e);
      }
    }
    if (!this.transport) {
      try {
        this.transport = await TransportWebUSB.create();
        console.warn('Transport is now set to use USB!');
      } catch (e) {
        this.transport = null;
        console.log('Couldn\'t set USB as transport!');
        console.error(e);
      }
    }
  }

  async transportCheck() {
    if (!this.transport) {
      await this.setTransport();
    }
    if (!this.transport) {
      throw new Error('NO_TRANSPORT_FOUND');
    }
  }

  async getPublicAddress(path: string) {
    await this.transportCheck();
    const xtz = new Tezos(this.transport);
    const result = await xtz
      .getAddress(path, true)
      .then((res: any) => {
        return this.sanitize(res);
      })
      .catch((e: any) => {
        throw e;
      });
    const pk = this.operationService.hex2pk(result.publicKey);
    return pk;
  }

  async requestLedgerSignature(op: string): Promise<string> {
    let signature;
    if (op.length <= 2290) {
      console.log('sign ledger operation');
      signature = await this.signOperation('03' + op, '44\'/1729\'/0\'/0\'');
    } else {
      console.log('sign ledger operation HASH');
      signature = await this.signHash(
        this.operationService.ledgerPreHash('03' + op),
        '44\'/1729\'/0\'/0\''
      );
    }
    return signature;
  }

  async signOperation(op: string, path: string): Promise<string | null> {
    if (!(['03', '05'] as any).includes(op.slice(0, 2))) {
      throw new Error('Invalid prefix');
    }
    await this.transportCheck();
    const xtz = new Tezos(this.transport);
    console.log('operation:', op);
    const result = await xtz
      .signOperation(path, op)
      .then((res: any) => {
        return this.sanitize(res);
      })
      .catch((e: any) => {
        console.warn(e);
        return null;
      });
    console.log(JSON.stringify(result));
    if (result && result.signature) {
      return result.signature;
    } else {
      return null;
    }
  }

  async signHash(hash: string, path: string) {
    if (hash.length !== 64) {
      throw new Error('Invalid hash!');
    }
    await this.transportCheck();
    const xtz = new Tezos(this.transport);
    const result = await xtz
      .signHash(path, hash)
      .then((res: any) => {
        return this.sanitize(res);
      })
      .catch((e: any) => {
        console.warn(e);
        return null;
      });
    console.log(JSON.stringify(result));
    if (result && result.signature) {
      return result.signature;
    } else {
      return null;
    }
  }

  private sanitize(res: any) {
    res = JSON.parse(JSON.stringify(res));
    // if (typeof res && res.publicKey !== 'string') {
    //   throw Error('Invalid pk');
    // }
    if (res && typeof res.signature !== 'string') {
      throw Error('Invalid signature');
    }
    return res;
  }
}
