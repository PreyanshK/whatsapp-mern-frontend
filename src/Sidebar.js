import { Avatar, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import SidebarChat from "./SidebarChat";
import { useSelector } from "react-redux";
import { selectUser } from "./features/userSlice";
import db, { auth } from "./firebase";
import axios from "./axios";
import Pusher from "pusher-js";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { SearchOutlined } from "@material-ui/icons";
import GroupAddIcon from '@material-ui/icons/GroupAdd';

const pusher = new Pusher('1b21e77f948fe6130ef0', {
  cluster: 'us2'
});

function Sidebar() {
  const user = useSelector(selectUser);
  const [chats, setChats] = useState([]);

  const getChats = () => {
      axios.get("/get/conversationList")
      .then((res) => {
          setChats(res.data)
      })
  }

  // Render all the chats from the DB
  useEffect(() => {
      getChats();

      // pusher subscribes to the channel "messages" 
      // and listens to the event called "newMessages"
      const channel = pusher.subscribe('chats');
      channel.bind('newChat', function(data) {
        getChats();
      });
  }, []);

    const addChat = (e) => {
        e.preventDefault();

        const chatName = prompt("Please enter a chat name");
        const firstMsg = prompt("Please send a welcome message");

        // Using the entered name, add the new chat into the database
        // Enter the first Msg inside that chat/conversation using chatId
        if(chatName) {
            
            let chatId = "";

            axios.post("/new/chatroom", {
                chatName: chatName
            }).then((res) => {
                chatId = res.data._id
            }).then(() => {
                axios.post(`/new/message?id=${chatId}`, {
                    message: firstMsg,
                    timestamp: Date.now(),
                    user: user
                })
            })
        }
    }

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar
          // onClick={() => auth.signOut()}
          src={user.photo}
          className="sidebar__avatar"
        />
        <div className="sidebar__headerRight">
            <IconButton>
                <DonutLargeIcon />
            </IconButton>

            <IconButton>
                <ChatIcon />
            </IconButton>
            
            <div onClick={() => auth.signOut()}>
                <IconButton>
                    <ExitToAppIcon />
                </IconButton>            
            </div>                    
        </div>
      </div>

      <div className="sidebar__search">
          <div className="sidebar__searchContainer">
              <SearchOutlined />
              
              <input 
                placeholder="Search or start a new chat"
                type="text"
              />
          </div>       
      </div>

      <div className="sidebar__newchat">

      </div>

      <div onClick={addChat} className="sidebar__newChat">                  
          <GroupAddIcon  style={{fill: "white"}}/>
          <div className="sidebarChat__newChat_text">
              <h2>New Chat</h2>
          </div> 
      </div>

      <div className="sidebar__chats">
        {/* {chats.map(({ id, data: { chatName } }) => (
          <SidebarChat key={id} id={id} chatName={chatName} />
        ))} */}

        {chats.map(({ id, name, timestamp }) => (
          <SidebarChat key={id} id={id} chatName={name} timestamp={timestamp} />
        ))}
      </div>

      <div className="sidebar__footer">
          <p>&copy; Preyansh Kachhia {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}

export default Sidebar;
