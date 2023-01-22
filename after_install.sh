#!/bin/bash

# Set the environment variables for the Lambda function
aws lambda update-function-configuration \
  --function-name createLambdaMailgunData \
  --environment Variables={MAILGUN_WEBHOOK_SIGNING_KEY=""}
