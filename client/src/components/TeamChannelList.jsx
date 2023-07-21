import React, {useState} from 'react';

import { AddChannel } from '../assets';



import { useChatContext } from 'stream-chat-react';


const TeamChannelList = ({ setToggleContainer, children, error = false, loading, type, isCreating, setIsCreating, setCreateType, setIsEditing, loadedChannels }) =>  {   
    const { client } = useChatContext();
        
    if(error) {
        return type === 'team' ? (
            <div className="team-channel-list">
                <p className="team-channel-list__message">
                    Connection error, please wait a moment and try again.
                </p>
            </div>
        ) : null
    }

    if(loading) {
        return (
            <div className="team-channel-list">
                <p className="team-channel-list__message loading">
                    {type === 'team' ? 'Channels' : 'Messages'} loading...
                </p>
            </div>
        )
    }
    
    
    if (loadedChannels != null && loadedChannels.length > 0) { 
        loadedChannels.map(channel => {
           
            channel.on( event => {      
               
                if (event.type === 'message.new' && channel.state.unreadCount > 0 ) { 
                    
                    const notification = new Notification(event.user.name, {
                        body: event.message?.text, 
                        icon: "./favicon.png",
                        tag: "bryan",
                        renotify: true
                        }).show;                                

              
             }
        });
       });
    }
       
    return (
        <div className="team-channel-list">
            <div className="team-channel-list__header">
                <p className="team-channel-list__header__title">
                    {type === 'team' ? 'Channels' : 'Direct Messages'}
                </p>                
                {((type==='team') && (client.user.role==='admin'))&&(
                <AddChannel 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType} 
                    setIsEditing={setIsEditing}
                    type={type === 'team' ? 'team' : 'messaging'}                    
                    setToggleContainer={setToggleContainer}
                />)}
                {(type!=='team')&&(
                <AddChannel 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType} 
                    setIsEditing={setIsEditing}
                    type={type === 'team' ? 'team' : 'messaging'}                    
                    setToggleContainer={setToggleContainer}
                />)}
            </div>
            {children}
        </div>
    )
}

export default TeamChannelList
