import dynamoDBClient from "../db";
import LambdaMailgunService from "./lambdaMailgunService"

const lambdaMailgunService = new LambdaMailgunService(dynamoDBClient());

export default lambdaMailgunService;