import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';

export const getAllLambdaMailgunData = {
    handler: `${handlerPath(__dirname)}/handler.getAllLambdaMailgunData`,
    events: [
        {
            http: {
                method: 'get',
                path: 'lambdamailgun/',
            },
        },
    ],
};

export const createLambdaMailgunData = {
    handler: `${handlerPath(__dirname)}/handler.createLambdaMailgunData`,
    events: [
        {
            http: {
                method: 'post',
                path: 'lambdamailgun',
                request: {
                    schemas: {
                        'application/json': schema,
                    },
                },
            },
        },
    ],
};

export const getLambdaMailgunData = {
    handler: `${handlerPath(__dirname)}/handler.getLambdaMailgunData`,
    events: [
        {
            http: {
                method: 'get',
                path: 'lambdamailgun/{id}',
            },
        },
    ],
};

export const deleteLambdaMailgunData = {
    handler: `${handlerPath(__dirname)}/handler.deleteLambdaMailgunData`,
    events: [
        {
            http: {
                method: 'delete',
                path: 'lambdamailgun/{id}',
            },
        },
    ],
};

