export default interface LambdaMailgun {
    lambdamailgundataId: string;
    signature: Signature;
    eventData: EventData;
    status: boolean;
    createdAt: string;
}
 
export interface Signature {
    timestamp: string;
    token: string;
    signature: string;
}

export interface EventData {
    event: string;
    timestamp: number;
    id: string;
}