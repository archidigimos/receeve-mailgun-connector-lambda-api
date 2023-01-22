import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy, parsePayload, verifyWebhook } from '@libs/lambda';
import lambdaMailgunService from '../../services'
import { Logger } from '@aws-lambda-powertools/logger';
import { v4 } from "uuid";

const logger = new Logger();

export const createLambdaMailgunData = middyfy(async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
    try {
        logger.addContext(context);
        const body = await parsePayload(event);
        verifyWebhook({
            signingKey: process.env.webhookSigningKey,
            timestamp: body['signature']['timestamp'],
            token: body['signature']['token'],
            signature: body['signature']['signature']
        })
        const id = v4();
        const lambdaMailgunData = await lambdaMailgunService.createLambdaMailgunData({
            lambdamailgundataId: id,
            signature: body['signature'],
            eventData: body['event-data'],
            createdAt: new Date().toISOString(),
            status: false
        }, logger);
        return formatJSONResponse({
            lambdaMailgunData
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})