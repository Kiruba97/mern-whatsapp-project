import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined } from '@mui/icons-material';
import { Avatar, IconButton } from '@mui/material'
import React, {useEffect, useState} from 'react'
import "./Chat.css"
import axios from 'axios'
import { useStateValue } from '../ContextApi/StateProvider';
import {useParams} from "react-router-dom"
import Pusher from "pusher-js"
  
const Chat = () => {

  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const [ {user} ] = useStateValue()
  const { roomId } = useParams()
  const [roomName, setRoomName] = useState("")
  const [updatedAt, setUpdatedAt] = useState(new Date())
  const [messages, setMessages] = useState([])


  useEffect(() => {
    if (roomId) {
      axios.get(`http://localhost:7000/room/${roomId}`).then((response) => {
        setRoomName(response.data.name);
        setUpdatedAt(response.data.updatedAt);
      });
      axios.get(`http://localhost:7000/messages/${roomId}`).then((response) => {
        setMessages(response.data);
     })
    }
  },[roomId]);

   useEffect(() => {
        setSeed(Math.floor(Math.random()*5000))
    }, [])

    useEffect(()=>{
      const pusher = new Pusher('19062e592b077a66fc46', {
        cluster: 'ap2'
      });
    
      const channel = pusher.subscribe("messages");
        channel.bind('inserted', function(message) {
          setMessages((prevMessages) => [...prevMessages, message])
        });

        return () => {
          channel.unbind_all();
          channel.unsubscribe();
        };
    
    },[])

    const sendMessage = async (e) => {
      e.preventDefault();
      
      if(!input) {
        return;
      }

      await axios.post("http://localhost:7000/messages/new", {
        message: input,
        name: user.displayName,
        timestamp: new Date(),
        uid: user.uid,
        roomId: roomId,
      })
      setInput("")
    }

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />

        <div className="chat__headerInfo">
          <h3>{roomName ? roomName : "Welcome to Whatsapp"}</h3>
          <p>
            {updatedAt 
             ? `Last updated at ${new Date(updatedAt).toString().slice(0, 25)}`
             : "Click on any group"}
          </p>
        </div>

        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {
        messages.map((message, index) => (
          <p className={`chat__message ${message.uid === user.uid && "chat__receiver"}`} key={index} >
          <span className="chat__name">{message.name}</span>
          {message.message}
          <span className="chat__timestamp">
            {new Date(message.timestamp).toString().slice(0, 25)}
          </span>
        </p>
        ))
      }
      </div>

      {roomName && <div className="chat__footer">
          <InsertEmoticon />
          <form>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message"
              type="text"
            />
            <button onClick={sendMessage}>Send a message</button>
          </form>
      </div>}
    </div>
  );
};

export default Chat