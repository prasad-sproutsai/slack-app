// import Image from "next/image";
"use client";
import styles from './Page.module.css';
export default function Home() {

    const initiateOAuth = () => {
      const slackAuthUrl = `https://slack.com/oauth/v2/authorize?client_id=${process.env.NEXT_PUBLIC_SLACK_CLIENT_ID}&scope=chat:write,app_mentions:read&redirect_uri=${process.env.NEXT_PUBLIC_SLACK_REDIRECT_URI}`;
      window.location.href = slackAuthUrl;
    };
  
    return (
      <div className={styles.container}>
        <h1>Slack App</h1>
        <button className={styles.button}onClick={initiateOAuth}>
      Connect with Slack
    </button>
      </div>
    );
}
