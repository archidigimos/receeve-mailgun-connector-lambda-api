import { handlerPath } from '@libs/handler-resolver';

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

export const updateLambdaMailgunData = {
    handler: `${handlerPath(__dirname)}/handler.updateLambdaMailgunData`,
    events: [
        {
            http: {
                method: 'put',
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

