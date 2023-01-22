#!/bin/bash

# Create the DynamoDB table
aws dynamodb create-table \
  --table-name LambdaMailgunTable \
  --attribute-definitions AttributeName=lambdamailgundataId,AttributeType=S \
  --key-schema AttributeName=lambdamailgundataId,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1

# Create the SNS topic
aws sns create-topic --name lambda-mailgun-sns
