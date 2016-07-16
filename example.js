/* eslint-disable import/no-extraneous-dependencies */

import test from 'tapava';
import got from 'got';

import httpTestServer from 'http-test-server';

test('simple GET', t =>
  httpTestServer((req, res) => {
    t.is(req.url, '/foo');
    t.is(req.method, 'GET');
    res.end('beep boop');
  })
    .then(({shutdown, baseUrl}) =>
      got(`${baseUrl}/foo`)
      .then(({body}) => {
        t.is(body, 'beep boop');

        return shutdown();
      })
    )
);

test('simple POST', t =>
  httpTestServer((req, res) => {
    t.is(req.url, '/foo');
    t.is(req.method, 'POST');
    t.is(req.body.toString(), 'heja');
    res.statusCode = 201;
    res.end('beep boop');
  })
    .then(({shutdown, baseUrl}) =>
      got(`${baseUrl}/foo`, {
        body: 'heja',
        method: 'post'
      })
      .then(({body, statusCode}) => {
        t.is(body, 'beep boop');
        t.is(statusCode, 201);

        return shutdown();
      })
    )
);
