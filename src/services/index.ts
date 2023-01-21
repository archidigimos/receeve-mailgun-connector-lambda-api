import dynamoDBClient from "../model";
import LambdaMailgunService from "./lambdaMailgunService"

const lambdaMailgunService = new LambdaMailgunService(dynamoDBClient());

export default lambdaMailgunService;