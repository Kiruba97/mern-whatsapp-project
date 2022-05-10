import React,{useState, useEffect} from 'react'
import "./Sidebar.css"
import SideBarChat from '../SideBarChat/SideBarChat'

import { Avatar, IconButton } from "@mui/material"
import { useStateValue } from '../ContextApi/StateProvider'
import { DonutLarge, Chat, MoreVert, SearchOutlined } from "@mui/icons-material"
import axios from 'axios'
import Pusher from "pusher-js"

const Sidebar = () => {

const[ {user} ] = useStateValue();
const [rooms, setRooms] = useState([]);

useEffect(() => {
  axios.get("http://localhost:7000/all/rooms").then((response) => {
    setRooms(response.data)
  })
}, [])

useEffect(()=>{
  const pusher = new Pusher('19062e592b077a66fc46', {
    cluster: 'ap2'
  });

  const channel = pusher.subscribe('room');
    channel.bind('inserted', function(room) {
      setRooms((prevRooms)=> [...prevRooms, room])
    });

},[])

return (
    <div className='sidebar'>
        <div className='sidebar__header'>
            <Avatar src={user.photoURL} />
            <div className='sidebar__headerRight'>
                <IconButton>
                    <DonutLarge />
                </IconButton>
                <IconButton>
                    <Chat />
                </IconButton>
                <IconButton>
                    <MoreVert />
                </IconButton>
            </div>
        </div>
        <div className='sidebar__search'>
          <div className='sidebar__searchContainer'>
            <SearchOutlined />
            <input type= "text" placeholder='Search or start new chat' />
          </div>
        </div>
        <div className='sidebar__chats'>
          <SideBarChat addNewChat />
          {rooms.map((room) => (
          <SideBarChat key={room._id} id={room._id} name={room.name} />
        ))}
        </div>
    </div>
  )
}

export default Sidebar