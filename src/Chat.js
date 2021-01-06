import React, { useEffect, useState } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import { SearchOutlined } from '@material-ui/icons';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import MoodIcon from '@material-ui/icons/Mood';
import MicIcon from '@material-ui/icons/Mic';
import { useSelector } from "react-redux";
import "./Chat.css";
import { selectChatId, selectChatName } from "./features/chatSlice";
import db from "./firebase";
import Message from "./Message";
import firebase from "firebase";
import { selectUser } from "./features/userSlice";
import FlipMove from "react-flip-move";
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import axios from "./axios";
import Pusher from "pusher-js";

const pusher = new Pusher('1b21e77f948fe6130ef0', {
  cluster: 'us2'
});

function Chat() {
  const user = useSelector(selectUser);
  const [input, setInput] = useState("");
  const chatName = useSelector(selectChatName);
  const chatId = useSelector(selectChatId);
  const [messages, setMessages] = useState([]);
  const [lastPhoto, setLastPhoto] = useState("");
  const [lastTimestamp, setLastTimestamp] = useState("");
  const [emoji, setEmoji] = useState(false);

  const getConversation = (chatId) => {
      if(chatId) {
          axios.get(`/get/conversation?id=${chatId}`).then((res) => {
              setMessages(res.data[0].conversation)
          })
      }
  }

  useEffect(() => {
    // when the chat component loads or chatId changes (changing the chat)
    // we want to unsubscribe to the pusher we are already subscribed to
    // that way only the chat we are in is refreshed and not every single
    // subscribed chat
    pusher.unsubscribe("messages");

    getConversation(chatId);

      // pusher subscribes to the channel "messages" 
      // and listens to the event called "newMessages"
      const channel = pusher.subscribe('messages');
      channel.bind('newMessage', function(data) {
        getConversation(chatId);
      });
  }, [chatId]);

  // used to display the most recent message and user in the sidebar chat
  const getSideBarChatElement = () => {
      axios.get(`/get/lastMessage?id=${chatId}`).then((res) => {
          // setLastMsg(res.data.message)
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
  }, [chatId]);

  const sendMessage = (e) => {
    e.preventDefault();
    console.log("You typed >>>", input);

    // add the message entered into the database
    // assign the server timestamp, to display the time based on the user's time zone
    axios.post(`/new/message?id=${chatId}`, {
        message: input,
        timestamp: Date.now(),
        user: user
    })

    setInput("");
  };

  const addEmoji = (e) => {
      let chosenEmoji = e.native;
      setInput(input + chosenEmoji);
  };

  const closeEmojiPicker = () => {
      if(emoji) {
          setEmoji(false);
      }
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={lastPhoto} />

        <div className="chat__headerInfo">
            <h3>
                { chatName 
                ? chatName
                : "Please click on a chat or start a new one"}
            </h3>
            {/* last seen will be the timestamp from the last message */}
            <p>
                Last seen{" "}
                { chatName 
                  ? new Date(parseInt(lastTimestamp)).toLocaleString()
                  : "unknown"}
            </p>
        </div>

        <div className="chat__headerRight">
            <IconButton>
                <SearchOutlined />
            </IconButton>
            <IconButton>
                <MoreVertIcon />
            </IconButton>
        </div>
      </div>

      {/* chat messages */}
      <div className="chat__messages">
        <FlipMove>
          {messages.map(({ user, _id, message, timestamp }) => (
            <Message key={_id} id={_id} sender={user} message={message} timestamp={timestamp}/>
          ))}
        </FlipMove>
      </div>

      <div className="chat__input">
        <IconButton>
            <MoodIcon 
            className="chat__emojiIcon" 
            onClick={ () => setEmoji(!emoji)}
            />
            {emoji ? <Picker onSelect={addEmoji} /> : null}
        </IconButton>
        <form>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onClick={closeEmojiPicker} 
            placeholder="Type a message"
            type="text"
          />
          <button onClick={sendMessage}>Send Message</button>
        </form>

        <IconButton>
          <MicIcon className="chat__mic" />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
