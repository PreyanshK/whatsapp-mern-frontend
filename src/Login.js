import { Button } from "@material-ui/core";
import React from "react";
import { auth, provider } from "./firebase";
import "./Login.css";

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch((error) => alert(error.message));
  };

  return (
    <div className="login">
          <div className="login__container">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt=""/>
              <div className="login__text">
                  <h1>Welcome to WhatsApp</h1>
              </div>

              <Button onClick={signIn}>
                  Sign In With Google
              </Button>
          </div>
    </div>
  );
}

export default Login;
