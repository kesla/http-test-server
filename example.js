/* eslint-disable import/no-extraneous-dependencies */

import test from "tape";
import got from "got";
import httpTestServer from "http-test-server";

test("simple GET", async (t) => {
  t.plan(3);

  const server = await httpTestServer((req, res) => {
    t.equal(req.url, "/foo");
    t.equal(req.method, "GET");
    res.end("beep boop");
  });

  const { body } = await got(`${server.baseUrl}/foo`);
  t.equal(body, "beep boop");

  await server.shutdown();
  t.end();
});

test("simple POST", async (t) => {
  t.plan(5);

  const server = await httpTestServer((req, res) => {
    t.equal(req.url, "/foo");
    t.equal(req.method, "POST");
    t.equal(req.body.toString(), "heja");
    res.statusCode = 201;
    res.end("beep boop");
  });

  const { body, statusCode } = await got(`${server.baseUrl}/foo`, {
    body: "heja",
    method: "post",
  });

  t.equal(body, "beep boop");
  t.equal(statusCode, 201);

  await server.shutdown();
  t.end();
});
