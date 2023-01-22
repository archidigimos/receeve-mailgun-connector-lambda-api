import { SNS } from "aws-sdk";
import LambdaMailgun from "../../model/LambdaMailgun";

const sns = new SNS();

const sendMessage = async (data: LambdaMailgun, logger: any) => {
    const params = {
        Message: JSON.stringify({ Provider: 'Mailgun', timestamp: data.eventData.timestamp, type: data.eventData.event }),
        // Message: JSON.stringify({ Provider: 'Mailgun', type: data.webhook_name }),
        TopicArn: process.env.snsTopicArn,
    };
    try {
        const result = await sns.publish(params).promise();
        logger.info(`Message sent to SNS topic: ${result.MessageId}`);
    } catch (err) {
        logger.info(`Error sending message to SNS topic: ${err}`);
        throw err;
    }
};

export default sendMessage;