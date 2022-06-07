const assert = require('assert');
const { webSocket } = require('rxjs/webSocket');

describe('transaction', () => {

  it('Web Socket should respond successfully based on requested message', function (done) {
    this.timeout(10000);
    const connection = webSocket({
      url: 'wss://master.dev.tezedge.com:443/rpc',
      WebSocketCtor: require('ws')
    });

    const responses = [];
    const firstId = 1000;
    const secondId = 2000;

    connection.asObservable().subscribe((message) => {
      responses.push(message);

      if (responses.length === 2) {
        assert.equal(responses[0].id, firstId);
        assert.equal(responses[1].id, secondId);
        assert.equal(
          responses
            .map(r => r.result)
            .every(response =>
              response.proof_of_work_nonce_size !== undefined
              && response.nonce_length !== undefined
              && response.michelson_maximum_type_size !== undefined
              && response.max_operations_time_to_live !== undefined
              && response.consensus_committee_size !== undefined
            ),
          true
        );
        done();
      }
    });
    connection.next({
      'jsonrpc': '2.0',
      'method': '/chains/main/blocks/head/context/constants',
      'id': firstId
    });
    connection.next({
      'jsonrpc': '2.0',
      'method': '/chains/main/blocks/head/context/constants',
      'id': secondId
    });
  });
});
