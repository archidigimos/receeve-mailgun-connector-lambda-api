import middy from "@middy/core";
import httpJsonBodyParserMiddleware from "@middy/http-json-body-parser";
import * as zlib from 'zlib';
import * as crypto from "crypto";

export const middyfy = (handler) => {
  return middy(handler).use(httpJsonBodyParserMiddleware());
}

const decompressGzip = async (data: any) => {
  return new Promise((resolve, reject) => {
    zlib.gunzip(Buffer.from(data, 'base64'), (err, buffer) => {
      if (err) reject(err);
      resolve(buffer.toString());
    });
  });
}

const decompressDeflate = async (data: any) => {
  return new Promise((resolve, reject) => {
    zlib.inflate(Buffer.from(data, 'base64'), (err, buffer) => {
      if (err) reject(err);
      resolve(buffer.toString());
    });
  });
}

const decompressBrotli = async (data: any) => {
  return new Promise((resolve, reject) => {
    zlib.brotliDecompress(Buffer.from(data, 'base64'), (err, buffer) => {
      if (err) reject(err);
      resolve(buffer.toString());
    });
  });
}

export const parsePayload = async (event: any): Promise<any> => {
  const headers = event.headers;
  const encoding = headers['content-encoding'];
  let body: any;
  switch (encoding) {
    case 'gzip':
      body = await decompressGzip(event.body);
      break;
    case 'deflate':
      body = await decompressDeflate(event.body);
      break;
    case 'br':
      body = await decompressBrotli(event.body);
      break;
    default:
      body = event.body;
  }
  if (encoding === 'gzip') {
    const buffer = Buffer.from(body, 'base64');
    body = zlib.gunzipSync(buffer).toString();
    body = JSON.parse(body);
  }
  return body;
}

export const verifyWebhook = (body: any) => {
  const data = {
    signingKey: process.env.MAILGUN_WEBHOOK_SIGNING_KEY,
    timestamp: body['signature']['timestamp'],
    token: body['signature']['token'],
    signature: body['signature']['signature']
  }
  const encodedToken = crypto
    .createHmac('sha256', data.signingKey)
    .update(data.timestamp.concat(data.token))
    .digest('hex');
  if (!(encodedToken === data.signature)) throw 'Webhook verification failed';
}