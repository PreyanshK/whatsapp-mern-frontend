import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { selectUser, login, logout } from "./features/userSlice";
import Login from "./Login";
import { auth } from "./firebase";
import Chat from "./Chat";
import Sidebar from "./Sidebar";

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user is logged in
        dispatch(
          login({
            uid: authUser.uid,
            photo: authUser.photoURL,
            email: authUser.email,
            displayName: authUser.displayName,
          })
        );
      } else {
        // user is logged out
        dispatch(logout());
      }
    });
  }, []);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <div className="app__body">
            <Sidebar />
            <Chat />
        </div>
      )}
      </div>
  );
}

export default App;
