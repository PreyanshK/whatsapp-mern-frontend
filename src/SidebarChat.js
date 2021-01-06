import { Avatar } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setChat } from "./features/chatSlice";
import db from "./firebase";
import "./SidebarChat.css";
import axios from "./axios";
import Pusher from "pusher-js";

const pusher = new Pusher('1b21e77f948fe6130ef0', {
  cluster: 'us2'
});

function SidebarChat({ id, chatName }) {
  const dispatch = useDispatch();
  const [chatInfo, setChatInfo] = useState([]);
  const [lastMsg, setLastMsg] = useState("");
  const [lastPhoto, setLastPhoto] = useState("");
  const [lastTimestamp, setLastTimestamp] = useState("");

    // used to display the most recent message and user in the sidebar chat
  const getSideBarChatElement = () => {
      axios.get(`/get/lastMessage?id=${id}`).then((res) => {
          setLastMsg(res.data.message)
          setLastPhoto(res.data.user.photo)
          setLastTimestamp(res.data.timestamp)
      });
  }

  useEffect(() => {
      getSideBarChatElement();

      // realtime functionality
      // pusher subscribes to the channel "messages" 
      // and listens to the event called "newMessages"
      const channel = pusher.subscribe('messages');
      channel.bind('newMessage', function(data) {
        getSideBarChatElement();
      });
  }, [id]);

  return (
    <div
      onClick={() =>
        dispatch(
          setChat({
            chatId: id,
            chatName: chatName,
          })
        )
      }
      className="sidebarChat"
    >
      <Avatar src={lastPhoto} />
      <div className="sidebarChat__info">
        <h2>{chatName}</h2>
        <p>{lastMsg}</p>
      </div>
    </div>
  );
}

export default SidebarChat;
