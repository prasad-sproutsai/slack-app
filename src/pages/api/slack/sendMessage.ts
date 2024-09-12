
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

import { NextApiRequest, NextApiResponse } from 'next';
import { WebClient } from '@slack/web-api';


dotenv.config();

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI!);
let db = client.db('slack_app');
let tokensCollection = db.collection('tokens');



interface SlackRequestBody {
  teamId: string;
  channel: string;
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { teamId, channel, message } = req.body as SlackRequestBody;

  console.log("team", teamId)
  console.log("Channel", channel)
  console.log("text", message)

// Fetch the installation using teamId;
const installation = await tokensCollection.findOne({ teamId: teamId });
// console.log("response",installation)
const accessToken = installation?.accessToken;
  if (!accessToken) {
    res.status(400).json({ error: 'Access token not found' });
    return;
  }

  try {
    const slackClient = new WebClient(accessToken);
    const result = await slackClient.chat.postMessage({
      channel,
      text:message,
    });

    res.status(200).json({ message: 'Message sent', data: result });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).send('Error sending message');
  }
}
