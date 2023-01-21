import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { SNS } from "aws-sdk";

import LambdaMailgun from "../model/LambdaMailgun";

const sns = new SNS();
export default class LambdaMailgunService {

    private Tablename: string = "LambdaMailgunTable";

    constructor(private docClient: DocumentClient) { }

    async sendSNSmessage(data: LambdaMailgun) {
        const params = {
          Message: JSON.stringify({ title: data.title, description: data.description }),
          // it is easy to pass reference to the topic as environment variable using aws cdk
          TopicArn: 'arn:aws:sns:us-east-1:348561083972:receeve-mailgun-connector-sns' 
        };
        await sns.publish(params).promise()
     }

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
        this.sendSNSmessage(lambdamailgundata);
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