# Receeve mailgun serverless lambda function with DynamoDB for webhook data storage and SNS for notification event trigger

# Scenario:

The scenario is that an email goes out via Mailgun (mailgun.com). Once it’s out, Mailgun sends various events back (open, clicked, etc). We have sent an email via Mailgun and now we expect those events sent to us via webhooks, hitting an API Gateway and then that information is proxied to a Lambda. The Lambda should do two things: save a copy of the raw webhook and publish a transformed version into SNS.

## Installation/deployment instructions

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Development environment setup and running

- Run `npm i` to install the project dependencies
- Run `serverless plugin install -n serverless-offline` to install the serverless-offline plugin
- Run `serverless plugin install -n serverless-dynamodb-local` to install the serverless-dynamodb-local plugin
- Run `serverless plugin install -n serverless-esbuild` to install the serverless-esbuild plugin
- Run `sls dynamodb install` to setup local DynamoDB instance
- Run `serverless offline start` to start the application locally for development and debug purpose

### Deploy to AWS cloudformation stack

- Run `npx sls deploy` to deploy this stack to AWS
- After deployment, set the `MAILGUN_WEBHOOK_SIGNING_KEY` variable under the environment variable section of the deployed lambda function from AWS management console

### 3rd party libraries

- [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts) - uses JSON-Schema definitions used by API Gateway for HTTP request validation to statically generate TypeScript types in your lambda's handler code base
- [middy](https://github.com/middyjs/middy) - middleware engine for Node.Js lambda. This template uses [http-json-body-parser](https://github.com/middyjs/middy/tree/master/packages/http-json-body-parser) to convert API Gateway `event.body` property, originally passed as a stringified JSON, to its corresponding parsed object
- [@serverless/typescript](https://github.com/serverless/typescript) - provides up-to-date TypeScript definitions for your `serverless.ts` service file