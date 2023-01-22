import type { AWS } from '@serverless/typescript';

import { createLambdaMailgunData } from '@functions/lambdamailgun';

const serverlessConfiguration: AWS = {
  service: 'receeve-mailgun-connector-lambda-api',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline', 'serverless-dynamodb-local'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
      MAILGUN_WEBHOOK_SIGNING_KEY: '',
    },
    iam: {
      role: {
        statements: [{
          Effect: "Allow",
          Action: [
            "dynamodb:DescribeTable",
            "dynamodb:Query",
            "dynamodb:Scan",
            "dynamodb:GetItem",
            "dynamodb:PutItem",
            "dynamodb:UpdateItem",
            "dynamodb:DeleteItem",
          ],
          Resource: "arn:aws:dynamodb:us-west-2:*:table/LambdaMailgunTable",
        }, {
          Effect: "Allow",
          Action: ["sns:Publish"],
          Resource: "arn:aws:sns:*:*:*"
        }],
      },

    },
  },
  functions: { createLambdaMailgunData },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    dynamodb: {
      start: {
        port: 5002,
        inMemory: true,
        migrate: true,
      },
      stages: "dev"
    }
  },
  resources: {
    Resources: {
      LambdaMailgunTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "LambdaMailgunTable",
          AttributeDefinitions: [{
            AttributeName: "lambdamailgundataId",
            AttributeType: "S",
          }],
          KeySchema: [{
            AttributeName: "lambdamailgundataId",
            KeyType: "HASH"
          }],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
          },
        }
      },
      LambdaMailgunSNS: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "lambda-mailgun-sns"
        }
      },
    }
  }
};

module.exports = serverlessConfiguration;