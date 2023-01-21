import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import lambdaMailgunService from '../../services'

import { v4 } from "uuid";

export const getAllLambdaMailgunData = middyfy(async (): Promise<APIGatewayProxyResult> => {
    const lambdaMailgunData = await lambdaMailgunService.getAllLambdaMailgunData();
    return formatJSONResponse({
        lambdaMailgunData
    })
})

export const createLambdaMailgunData = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const id = v4();
        const lambdaMailgunData = await lambdaMailgunService.createLambdaMailgunData({
            lambdamailgundataId: id,
            title: event.body.title,
            description: event.body.description,
            createdAt: new Date().toISOString(),
            status: false
        })
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

export const getLambdaMailgunData = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
        const lambdaMailgunData = await lambdaMailgunService.getLambdaMailgunData(id)
        return formatJSONResponse({
            lambdaMailgunData, id
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})

export const updateLambdaMailgunData = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
        const lambdaMailgunData = await lambdaMailgunService.updateLambdaMailgunData(id, { status: event.body.status })
        return formatJSONResponse({
            lambdaMailgunData, id
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})

export const deleteLambdaMailgunData = middyfy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const id = event.pathParameters.id;
    try {
        const lambdaMailgunData = await lambdaMailgunService.deleteLambdaMailgunData(id)
        return formatJSONResponse({
            lambdaMailgunData, id
        });
    } catch (e) {
        return formatJSONResponse({
            status: 500,
            message: e
        });
    }
})