import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    const handleChange = (event) => {
        event.preventDefault();

        setChannelName(event.target.value);
    }

    return (
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input value={channelName} onChange={handleChange} placeholder="channel-name" />
            <p>Add Members</p>
        </div>
    )
}

const CreateChannel = ({ createType, setIsCreating }) => {
    const { client, setActiveChannel } = useChatContext();
    const [selectedUsers, setSelectedUsers] = useState([client.userID || ''])
    const [channelName, setChannelName] = useState('');

    const createChannel = async (e) => {
        e.preventDefault();
        var filters;
                
        var existingChannel ;
        
          
        try {
            //previously has "await"
            var newChannel;
            if (createType === 'team')
                newChannel =  client.channel(createType, channelName.replace(/\s/g, ''), {
                    name: channelName, members: selectedUsers, hotline: 1
                });
            else   {
               /* filters = {
                    type: 'messaging',
                    member_count: 2,
                    members: { $eq: [selectedUsers[0], client.userID] },
                  };
                [existingChannel] = await client.queryChannels(filters);
                console.log(existingChannel);
                console.log(selectedUsers);
                if (existingChannel) return setActiveChannel(existingChannel);*/
                newChannel =  client.channel(createType,  {
                    members: selectedUsers, 
                }); 
            }

            await newChannel.watch();

            setChannelName('');
            setSelectedUsers([client.userID]);
            setIsCreating(false);            
            setActiveChannel(newChannel);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="create-channel__container">
            <div className="create-channel__header">
                <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
                <CloseCreateChannel setIsCreating={setIsCreating} />
            </div>
            {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName}/>}
            <UserList setSelectedUsers={setSelectedUsers} />
            <div className="create-channel__button-wrapper" onClick={createChannel}>
                <p>{createType === 'team' ? 'Create Channel' : 'Direct Message'}</p>
            </div>
        </div>
    )
}

export default CreateChannel
