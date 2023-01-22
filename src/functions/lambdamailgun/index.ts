import { handlerPath } from '@libs/handler-resolver';

export const createLambdaMailgunData = {
    handler: `${handlerPath(__dirname)}/handler.createLambdaMailgunData`,
    events: [
        {
            http: {
                method: 'post',
                path: 'lambdamailgun',
                cors: true,
            },
        },
    ],
    environment: {
        snsTopicArn: `arn:aws:sns:${process.env.region}:${process.env.accountId}:lambda-mailgun-sns`,
        webhookSigningKey: `${process.env.webhookSigningKey}`,
    }
};