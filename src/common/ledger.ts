import 'babel-polyfill';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import * as Bs58check from 'bs58check';
import type Transport from '@ledgerhq/hw-transport';
import { blake2b } from 'blakejs';
// @ts-ignore
import Tezos from '@obsidiansystems/hw-app-xtz';

export type PublicKeyData = {
  publicKey: string;
  publicKeyHash: string;
}

export type LedgerState = {
  keys: PublicKeyData[],
  transportHolder?: { transport: Transport | undefined };
}

export class LedgerUtils {

  private readonly prefix: any = {
    tz1: new Uint8Array([6, 161, 159]),
    tz2: new Uint8Array([6, 161, 161]),
    tz3: new Uint8Array([6, 161, 164]),
    edpk: new Uint8Array([13, 15, 37, 217]),
    sppk: new Uint8Array([3, 254, 226, 86]),
    edsk: new Uint8Array([43, 246, 78, 7]),
    spsk: new Uint8Array([17, 162, 224, 201]),
    edsig: new Uint8Array([9, 245, 205, 134, 18]),
    spsig: new Uint8Array([13, 115, 101, 19, 63]),
    sig: new Uint8Array([4, 130, 43]),
    o: new Uint8Array([5, 116]),
    B: new Uint8Array([1, 52]),
    TZ: new Uint8Array([3, 99, 29]),
    KT: new Uint8Array([2, 90, 121])
  };
  private readonly DEFAULT_PATH: string = '44\'/1729\'/0\'/0\'';
  transport: Transport | undefined;

  async getAddress(transportHolder: { transport: Transport | undefined }): Promise<LedgerState> {
    const derivationPath = (derPath: string): boolean => {
      const m = derPath.match(/^44'\/1729('\/[0-9]+)+'$/g);
      return !!(m || derPath === '44\'/1729\'');
    };
    const noResponse = {
      keys: [{ publicKey: undefined, publicKeyHash: undefined }],
      transport: undefined
    };

    const path: string = this.DEFAULT_PATH;
    if (derivationPath(path)) {
      try {
        console.log(transportHolder);
        const pk = await this.getPublicAddress(path, transportHolder);
        this.transport.close();
        return {
          keys: [
            {
              publicKey: pk,
              publicKeyHash: this.pk2pkh(pk)
            }
          ],
        };
      } catch (e) {
        console.error(e);
      }
    } else {
      console.warn('Invalid derivation path');
    }
    return noResponse;
  }

  async requestLedgerSignature(op: string, transportHolder: { transport: Transport | undefined }): Promise<string> {
    const signature = await this.signOperation('03' + op, transportHolder);
    this.transport.close();
    return signature;
  }

  private async getPublicAddress(path: string, transportHolder: { transport: Transport | undefined }): Promise<string> {
    await this.transportCheck();
    transportHolder.transport = this.transport;
    const xtz = new Tezos(this.transport);
    const result = await xtz
      .getAddress(path, true)
      .then((res: any) => {
        return LedgerUtils.sanitize(res);
      })
      .catch((e: any) => {
        this.transport.close();
        transportHolder.transport = this.transport;
        throw e;
      });
    return this.hex2pk(result.publicKey);
  }

  private async transportCheck(): Promise<void> {
    if (!this.transport) {
      await this.setTransport();
    }
    if (!this.transport) {
      throw new Error('NO_TRANSPORT_FOUND');
    }
  }

  private async setTransport(): Promise<void> {
    if (!this.transport) {
      try {
        this.transport = await TransportNodeHid.create();
        console.log('Transport is now set to use NodeHID!');
      } catch (e) {
        this.transport = undefined;
        console.warn('Couldn\'t set NodeHID as transport!');
        console.error(e);
      }
    }
    if (!this.transport) {
      try {
        console.log('setting new transport');
        this.transport = await TransportWebHID.create();
        console.log('Transport is now set to use WebHID!');
      } catch (e) {
        this.transport = undefined;
        console.warn('Couldn\'t set WebHID as transport!');
        console.error(e);
      }
    }
  }

  private async signOperation(op: string, transportHolder: { transport: Transport | undefined }): Promise<string> {
    if (!(['03', '05'] as any).includes(op.slice(0, 2))) {
      throw new Error('Invalid prefix');
    }
    await this.transportCheck();
    const xtz = new Tezos(this.transport);
    const result = await xtz
      .signOperation(this.DEFAULT_PATH, op)
      .then((res: any) => LedgerUtils.sanitize(res))
      .catch((e: any) => {
        this.transport.close();
        transportHolder.transport = this.transport;
        throw e;
      });

    return (result && result.signature) ? result.signature : '';
  }

  private static sanitize(res: any): any {
    res = JSON.parse(JSON.stringify(res));
    if (res && res.publicKey && typeof res.publicKey !== 'string') {
      throw Error('Invalid PK');
    }
    if (res && res.signature && typeof res.signature !== 'string') {
      throw Error('Invalid signature');
    }
    return res;
  }

  private pk2pkh(pk: string): string {
    if (pk.length === 54 && pk.slice(0, 4) === 'edpk') {
      const pkDecoded = LedgerUtils.b58checkDecode(pk, this.prefix.edpk);
      const payload = blake2b(pkDecoded, undefined, 20);
      return LedgerUtils.b58checkEncode(payload, this.prefix.tz1);
    }
    throw new Error('Invalid public key');
  }

  private hex2pk(hex: string): string {
    return LedgerUtils.b58checkEncode(this.hex2buf(hex.slice(2, 66)), this.prefix.edpk);
  }

  private hex2buf(hex: any): Uint8Array {
    return new Uint8Array(
      hex.match(/[\da-f]{2}/gi).map((h: string) => parseInt(h, 16))
    );
  }

  private static buf2hex(buffer: any): string {
    const byteArray = new Uint8Array(buffer);
    const hexParts = [];
    for (let i = 0; i < byteArray.length; i++) {
      const hex = byteArray[i].toString(16);
      const paddedHex = ('00' + hex).slice(-2);
      hexParts.push(paddedHex);
    }
    return hexParts.join('');
  }

  private static b58checkEncode(payload: Uint8Array, prefix?: Uint8Array): string {
    if (prefix === undefined) {
      return '';
    }
    const n = new Uint8Array(prefix.length + payload.length);
    n.set(prefix);
    n.set(payload, prefix.length);
    return Bs58check.encode(Buffer.from(LedgerUtils.buf2hex(n), 'hex'));
  }

  private static b58checkDecode(enc: string, prefix: Uint8Array): Buffer {
    let n = Bs58check.decode(enc);
    n = n.slice(prefix.length);
    return n;
  }
}
