import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as zlib from 'zlib';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import lambdaMailgunService from '../../services'
import { Logger } from '@aws-lambda-powertools/logger';
import { v4 } from "uuid";

const logger = new Logger();

export const getAllLambdaMailgunData = middyfy(async (): Promise<APIGatewayProxyResult> => {
    const lambdaMailgunData = await lambdaMailgunService.getAllLambdaMailgunData();
    return formatJSONResponse({
        lambdaMailgunData
    })
})

async function decompressGzip(data: any) {
    return new Promise((resolve, reject) => {
        zlib.gunzip(Buffer.from(data, 'base64'), (err, buffer) => {
            if (err) reject(err);
            resolve(buffer.toString());
        });
    });
}

async function decompressDeflate(data: any) {
    return new Promise((resolve, reject) => {
        zlib.inflate(Buffer.from(data, 'base64'), (err, buffer) => {
            if (err) reject(err);
            resolve(buffer.toString());
        });
    });
}

async function decompressBrotli(data: any) {
    return new Promise((resolve, reject) => {
        zlib.brotliDecompress(Buffer.from(data, 'base64'), (err, buffer) => {
            if (err) reject(err);
            resolve(buffer.toString());
        });
    });
}


export const createLambdaMailgunData = middyfy(async (event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> => {
    let body: any = {};
    try {
        logger.addContext(context);
        const headers = event.headers;
        const encoding = headers['content-encoding'];
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
        // const data = JSON.parse(body);
        const id = v4();
        const lambdaMailgunData = await lambdaMailgunService.createLambdaMailgunData({
            lambdamailgundataId: id,
            signature: body.signature,
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
            message: e,
            body: body
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