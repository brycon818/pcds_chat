import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelListContainer, ChannelContainer, Auth, } from './components';

import 'stream-chat-react/dist/css/v2/index.css';
//import 'stream-chat-react/dist/css/index.css';
//import 'stream-chat-react/dist/scss/v2/index.scss'
import './App.css';

const cookies = new Cookies();

const apiKey = '4c76954fycg4';
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

    if(!authToken) return <Auth />

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
                    Prithibi needs your permission to&nbsp;
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
