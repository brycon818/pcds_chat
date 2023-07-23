import React, {useState} from 'react';

import { AddChannel } from '../assets';



import { useChatContext } from 'stream-chat-react';



const TeamChannelList = ({ setToggleContainer, children, error = false, loading, type, isCreating, setIsCreating, setCreateType, setIsEditing, loadedChannels }) =>  {   
    const { client } = useChatContext();
    const [messageId, setMessageId] = useState();
    const [count, setCount] = useState(0);
        
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
