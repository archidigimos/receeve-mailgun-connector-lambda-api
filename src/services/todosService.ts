import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { SNS } from "aws-sdk";

import Todo from "../model/Todo";

const sns = new SNS();
export default class TodoServerice {

    private Tablename: string = "TodosTable";

    constructor(private docClient: DocumentClient) { }

    async sendSNSmessage(data: string) {
        const params = {
          Message: 'test from code',
          // it is easy to pass reference to the topic as environment variable using aws cdk
          TopicArn: 'arn:aws:sns:us-east-1:348561083972:receeve-mailgun-connector-sns' 
        };
        await sns.publish(params).promise()
     }

    async getAllTodos(): Promise<Todo[]> {
        const todos = await this.docClient.scan({
            TableName: this.Tablename,
        }).promise()
        return todos.Items as Todo[];
    }

    async createTodo(todo: Todo): Promise<Todo> {
        await this.docClient.put({
            TableName: this.Tablename,
            Item: todo
        }).promise()
        this.sendSNSmessage(todo.description);
        return todo as Todo;

    }

    async getTodo(id: string): Promise<any> {

        const todo = await this.docClient.get({
            TableName: this.Tablename,
            Key: {
                todosId: id
            }
        }).promise()
        if (!todo.Item) {
            throw new Error("Id does not exit");
        }
        return todo.Item as Todo;

    }

    async updateTodo(id: string, todo: Partial<Todo>): Promise<Todo> {
        const updated = await this.docClient
            .update({
                TableName: this.Tablename,
                Key: { todosId: id },
                UpdateExpression:
                    "set #status = :status",
                ExpressionAttributeNames: {
                    "#status": "status",
                },
                ExpressionAttributeValues: {
                    ":status": todo.status,
                },
                ReturnValues: "ALL_NEW",
            })
            .promise();

        return updated.Attributes as Todo;
    }

    async deleteTodo(id: string): Promise<any> {
        return await this.docClient.delete({
            TableName: this.Tablename,
            Key: {
                todosId: id
            }
        }).promise()

    }
}
