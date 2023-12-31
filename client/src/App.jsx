import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';
import dotenv from "dotenv";



import { ChannelListContainer, ChannelContainer, Auth, } from './components';

import 'stream-chat-react/dist/css/v2/index.css';
//import 'stream-chat-react/dist/css/index.css';
//import 'stream-chat-react/dist/scss/v2/index.scss'
import './App.css';

dotenv.config();

const cookies = new Cookies();

const apiKey =  process.env.REACT_APP_STREAM_API_KEY;
const authToken = cookies.get("token");

const client = StreamChat.getInstance(apiKey);

if(authToken) {
    client.connectUser({
        id: cookies.get('userId'),
        name: cookies.get('username'),
        fullName: cookies.get('fullName'),
        image: cookies.get('avatarURL'),
        hashedPassword: cookies.get('hashedPassword'),
        phoneNumber: cookies.get('phoneNumber'),        
    }, authToken)
}



const App = () => {
    const [createType, setCreateType] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [showNotificationBanner, setShowNotificationBanner] = useState(false);
   // const [isInvalidLogin, setIsinvalidLogin] = useState(false);     
  
    if(!authToken) return <Auth />
    
  
    client.on("message.new", event => {
      // Do something with the new message
      if (event.user.name !== cookies.get('username')){
      const notification = new Notification(event.user.name, {
        body: event.message.text, 
        icon: "./favicon.png",
        tag: event.message.id,
        renotify: false
        }).show;   
        
    }});

    client.on((event) => {
      if (event.total_unread_count !== undefined) {
                     navigator.setAppBadge(event.total_unread_count);                               
      }      
   });
    

    if (Notification.permission === 'default')
    {      
    if (!showNotificationBanner)
    setShowNotificationBanner(true);   }

    function grantPermission() {        
      if (Notification.permission === 'granted') {      
       // toast.success('You are already subscribed to web notifications');
        return;
      }
      
      if (
        Notification.permission === "denied" ||
        Notification.permission === "default"
      ) {
        Notification.requestPermission().then(result => {
          if (result === 'granted') {
            window.location.reload();
            new Notification('New message from Prithibi', {
              body: 'Nice, notifications are now enabled!',
              icon: "./public/favicon.png",
            });
          }
        });
      }
      setShowNotificationBanner(false);
    }

    

    return (
        <div>
            {showNotificationBanner && (
                <div className="alert">
                <p>
                    PriChat needs your permission to&nbsp;
                    <button onClick={grantPermission}>
                    enable desktop notifications
                    </button>
                </p>
                </div>
            )}          
        <div className="app__wrapper">    
        
            <Chat client={client} theme="team" >            
                <ChannelListContainer 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType}
                    setIsEditing={setIsEditing}
                    setIsEditingProfile={setIsEditingProfile}
                />
                <ChannelContainer 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    isEditingProfile={isEditingProfile}
                    setIsEditingProfile={setIsEditingProfile}
                    createType={createType}
                />                
            </Chat>
        </div>
        </div>
    );
}

export default App;
