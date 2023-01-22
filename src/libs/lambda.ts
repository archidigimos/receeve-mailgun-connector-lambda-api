import middy from "@middy/core";
import httpJsonBodyParserMiddleware from "@middy/http-json-body-parser";
// import httpUrlencodeBodyParserMiddleware from '@middy/http-urlencode-body-parser';
// import httpUrlencodePathParametersParserMiddleware from '@middy/http-urlencode-path-parser';
// import httpMultipartBodyParserMiddleware from '@middy/http-multipart-body-parser';

export const middyfy = (handler) => {
  return middy(handler).use(httpJsonBodyParserMiddleware());
}
