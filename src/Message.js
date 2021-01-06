import { Avatar } from "@material-ui/core";
import React, { forwardRef } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import "./Message.css";

const Message = forwardRef(
  (
    // { id, contents: { timestamp, displayName, email, message, photo, uid } },
    { id, sender, message, timestamp },
    ref
  ) => {
    const user = useSelector(selectUser);

    return (
      <div
        ref={ref}
        // className={`message ${user.email === email && "message__sender"}`}
        className={`message ${user.email === sender.email && "message__sender"}`}
      >
        <Avatar className="message__photo" src={sender.photo} />
        {/* <Avatar className="message__photo" src={photo} /> */}
        <p>
          {message}
          <small className="message__timestamp">{new Date(parseInt(timestamp)).toLocaleString()}</small>
        </p>
      </div>
    );
  }
);

export default Message;
