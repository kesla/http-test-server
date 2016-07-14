import http from 'http';

import shutdown from 'http-shutdown';
import streamToPromise from 'stream-to-promise';

module.exports = onRequest =>
  new Promise(resolve => {
    const _server = http.createServer((req, res) => {
      streamToPromise(req)
        .then(body => {
          req.body = body;
          onRequest(req, res);
        });
    }).listen(0, () => resolve(_server));
  })
  .then(server => {
    shutdown(server);

    return {
      shutdown: () => new Promise(resolve => {
        server.shutdown(resolve);
      }),
      baseUrl: `http://localhost:${server.address().port}`
    };
  });
