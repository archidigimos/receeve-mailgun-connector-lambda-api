import { SNS } from "aws-sdk";
import LambdaMailgun from "../../model/LambdaMailgun";

const sns = new SNS();

const sendMessage = async (data: LambdaMailgun) => {
    const params = {
        // Message: JSON.stringify({ Provider: 'Mailgun', timestamp: data.eventData.timestamp, type: data.eventData.event }),
        Message: JSON.stringify({ Provider: 'Mailgun', type: data.webhook_name }),
        TopicArn: process.env.snsTopicArn,
    };
    try {
        const result = await sns.publish(params).promise();
        console.log(`Message sent to SNS topic: ${result.MessageId}`);
    } catch (err) {
        console.log(`Error sending message to SNS topic: ${err}`);
        throw err;
    }
};

export default sendMessage;