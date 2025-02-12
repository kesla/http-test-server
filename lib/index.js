// @ts-check

const http = require("http");
const shutdown = require("http-shutdown");
const streamToPromise = require("stream-to-promise");

/**
 * @param {import('.').RequestHandler} onRequest
 * @returns {Promise<{ shutdown: () => Promise<void>, baseUrl: string }>}
 */
module.exports = async (onRequest) => {
  const createServer = () => {
    return new Promise((resolve) => {
      const _server = http
        .createServer(async (httpReq, res) => {
          /** @type {import('.').CustomRequest} */
          const req = /** @type {any} */ (httpReq);
          const body = await streamToPromise(req);
          req.body = body;
          onRequest(req, res);
        })
        .listen(0, () => resolve(_server));
    });
  };

  const server = await createServer();
  shutdown(server);

  return {
    shutdown: () =>
      new Promise((resolve) => {
        server.shutdown(resolve);
      }),
    baseUrl: `http://localhost:${server.address().port}/`,
  };
};
