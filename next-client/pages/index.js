import React, { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import EmailPassword from "supertokens-auth-react/recipe/emailpassword";
import dynamic from "next/dynamic";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const EmailPasswordAuthNoSSR = dynamic(
  new Promise((res) => res(EmailPassword.EmailPasswordAuth)),
  { ssr: false }
);

export default function Home(props) {
  return (
    <EmailPasswordAuthNoSSR>
      <ProtectedPage />
    </EmailPasswordAuthNoSSR>
  );
}

function ProtectedPage() {
  let { userId } = useSessionContext();

  async function logoutClicked() {
    await EmailPassword.signOut();
    EmailPassword.redirectToAuth();
  }

  async function fetchUserData() {
    const res = await fetch("http://localhost:8000/api/user");
    if (res.status === 200) {
      const json = await res.json();
      alert(JSON.stringify(json));
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>SuperTokens 💫</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <p className={styles.description}>
          You are authenticated with SuperTokens! (UserID: {userId})
        </p>

        <div
          style={{
            display: "flex",
            height: "70px",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingLeft: "75px",
            paddingRight: "75px",
          }}
        >
          <div
            onClick={logoutClicked}
            style={{
              display: "flex",
              width: "116px",
              height: "42px",
              backgroundColor: "#000000",
              borderRadius: "10px",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: "bold",
            }}
          >
            SIGN OUT
          </div>
        </div>
        <div
          style={{
            display: "flex",
            height: "70px",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingLeft: "75px",
            paddingRight: "75px",
          }}
        >
          <div
            onClick={fetchUserData}
            style={{
              display: "flex",
              width: "150px",
              height: "42px",
              backgroundColor: "rgb(247 54 54)",
              borderRadius: "10px",
              cursor: "pointer",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontWeight: "bold",
            }}
          >
            FETCH USER API
          </div>
        </div>
      </main>
    </div>
  );
}
