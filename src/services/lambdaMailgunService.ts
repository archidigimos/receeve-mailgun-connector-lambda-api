import { DocumentClient } from "aws-sdk/clients/dynamodb";

import LambdaMailgun from "../model/LambdaMailgun";
import sendMessage from "./snsservice";
export default class LambdaMailgunService {

    private Tablename: string = "LambdaMailgunTable";

    constructor(private docClient: DocumentClient) { }

    async createLambdaMailgunData(lambdamailgundata: LambdaMailgun, logger: any): Promise<LambdaMailgun> {
        await this.docClient.put({
            TableName: this.Tablename,
            Item: lambdamailgundata
        }).promise()
        await sendMessage(lambdamailgundata, logger);
        return lambdamailgundata as LambdaMailgun;
    }
}