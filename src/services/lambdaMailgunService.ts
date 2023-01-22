import { DocumentClient } from "aws-sdk/clients/dynamodb";

import LambdaMailgun from "../db/LambdaMailgun";
import sendMessage from "./snsservice";
export default class LambdaMailgunService {

    private Tablename: string = "LambdaMailgunTable";

    constructor(private docClient: DocumentClient) { }

    async createLambdaMailgunData(lambdamailgundata: LambdaMailgun, logger: any): Promise<any> {
        await this.docClient.put({
            TableName: this.Tablename,
            Item: lambdamailgundata
        }).promise()
        const result = await sendMessage(lambdamailgundata, logger);
        return result;
    }
}