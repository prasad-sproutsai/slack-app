import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const client = new MongoClient(process.env.NEXT_PUBLIC_MONGO_URI!);



let db:any
let tokensCollection:any;

const connectToMongo = async () => {
    if (!db) {
      await client.connect();
      db = client.db('slack_app');
      tokensCollection = db.collection('tokens');
    }
  };

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { code } = req.query;

  console.log("Code", code);

  try {
    // Exchange code for access token
    await connectToMongo();
    const response = await axios.post('https://slack.com/api/oauth.v2.access', null, {
      params: {
        client_id: process.env.NEXT_PUBLIC_SLACK_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_SLACK_CLIENT_SECRET,
        code: code as string,
        redirect_uri: process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const { access_token, team } = response.data;
    console.log("Data", access_token, team)
    // Store the token in MongoDB
    await tokensCollection.updateOne(
      { teamId: team?.id },
      { $set: { accessToken: access_token, teamId: team?.id } },
      { upsert: true }
    );
    res.redirect('/'); // Redirect to your app’s main page or a success page
  } catch (error) {
    console.error('OAuth Error:', error);
    res.status(500).send('OAuth failed');
  }
};

export default handler;
