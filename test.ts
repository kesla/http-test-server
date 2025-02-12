import { Agent } from "http";
import tape from "tape";
import got from "got";
import setupTestServer from "./lib";

tape("simple GET", async (t) => {
  const server = await setupTestServer((req, res) => {
    t.equal(req.url, "/foo");
    t.equal(req.method, "GET");
    res.end("beep boop");
  });

  try {
    const { body } = await got(`${server.baseUrl}foo`);
    t.equal(body, "beep boop");
  } finally {
    await server.shutdown();
  }

  t.end();
});

tape("simple POST", async (t) => {
  const server = await setupTestServer((req, res) => {
    t.equal(req.url, "/foo");
    t.equal(req.method, "POST");
    t.equal(req.body.toString(), "heja");
    res.statusCode = 201;
    res.end("beep boop");
  });

  try {
    const { body, statusCode } = await got(`${server.baseUrl}foo`, {
      body: "heja",
      method: "post",
    });
    t.equal(body, "beep boop");
    t.equal(statusCode, 201);
  } finally {
    await server.shutdown();
  }

  t.end();
});

tape("keep alive request", async (t) => {
  const server = await setupTestServer((req, res) => {
    t.equal(req.url, "/foo");
    t.equal(req.method, "GET");
    res.end("beep boop");
  });

  try {
    const { body } = await got(`${server.baseUrl}foo`, {
      agent: {
        http: new Agent({
          keepAlive: true,
        }),
      },
    });
    t.equal(body, "beep boop");
  } finally {
    await server.shutdown();
  }

  t.end();
});
