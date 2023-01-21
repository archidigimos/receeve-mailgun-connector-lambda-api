import { DocumentClient } from "aws-sdk/clients/dynamodb";
import * as crypto from "crypto";

import LambdaMailgun from "../model/LambdaMailgun";
import sendMessage from "./snsservice";
export default class LambdaMailgunService {

    private Tablename: string = "LambdaMailgunTable";

    constructor(private docClient: DocumentClient) { }

    async getAllLambdaMailgunData(): Promise<LambdaMailgun[]> {
        const lambdamailgundata = await this.docClient.scan({
            TableName: this.Tablename,
        }).promise()
        return lambdamailgundata.Items as LambdaMailgun[];
    }

    async createLambdaMailgunData(lambdamailgundata: LambdaMailgun): Promise<LambdaMailgun> {
        await this.docClient.put({
            TableName: this.Tablename,
            Item: lambdamailgundata
        }).promise()
        await sendMessage(lambdamailgundata);
        return lambdamailgundata as LambdaMailgun;

    }

    async getLambdaMailgunData(id: string): Promise<any> {

        const lambdamailgundata = await this.docClient.get({
            TableName: this.Tablename,
            Key: {
                lambdamailgundataId: id
            }
        }).promise()
        if (!lambdamailgundata.Item) {
            throw new Error("Id does not exit");
        }
        return lambdamailgundata.Item as LambdaMailgun;

    }

    async updateLambdaMailgunData(id: string, lambdamailgundata: Partial<LambdaMailgun>): Promise<LambdaMailgun> {
        const updated = await this.docClient
            .update({
                TableName: this.Tablename,
                Key: { lambdamailgundataId: id },
                UpdateExpression:
                    "set #status = :status",
                ExpressionAttributeNames: {
                    "#status": "status",
                },
                ExpressionAttributeValues: {
                    ":status": lambdamailgundata.status,
                },
                ReturnValues: "ALL_NEW",
            })
            .promise();

        return updated.Attributes as LambdaMailgun;
    }

    async deleteLambdaMailgunData(id: string): Promise<any> {
        return await this.docClient.delete({
            TableName: this.Tablename,
            Key: {
                lambdamailgundataId: id
            }
        }).promise()

    }
}
