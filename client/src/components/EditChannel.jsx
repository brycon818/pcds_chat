import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { ChannelMembersList } from './';
import { CloseCreateChannel } from '../assets';
import { Switch } from 'react-switch-input';

const ChannelNameInput = ({ channelName = '', setChannelName, isHotlineChannel, setIsHotlineChannel }) => {
    const handleChange = (event) => {
        event.preventDefault();

        setChannelName(event.target.value);
    }

    const handleChangeSwitch = e => {
       const checked = e.target.checked;
       console.log({checked});
       
      if (checked)
          setIsHotlineChannel("1");
       else 
          setIsHotlineChannel("0");
      }

    
    return (
        <div className="channel-name-input__wrapper">
            
            <input value={channelName} onChange={handleChange} placeholder="channel-name" />                                            
            <div className="mt-2 switch_container">                            
                <label  for="hotline_switch">This is a hotline Channel </label>
                <Switch className="pt-2" 
                        id="hotline_switch"
                        checked={(isHotlineChannel === "1") ? true: false}
                        onChange={handleChangeSwitch}
                />                                
            </div>
            <div>
                <p>Add Members</p>
            </div>
        </div>
    )
}

const EditChannel = ({ setIsEditing }) => {
    const { channel } = useChatContext();
    const [channelName, setChannelName] = useState(channel?.data?.name);
    const [isHotlineChannel, setIsHotlineChannel] = useState(channel.data.hotline || "0");
    const [selectedUsers, setSelectedUsers] = useState([])
    var hotlineChannel;
    
    const updateChannel = async (event) => {
        event.preventDefault();

        const nameChanged = channelName !== (channel.data.name || channel.data.id);
        const hotlineChanged = isHotlineChannel !== (channel.data.hotline || "0");

        if(nameChanged) {
            await channel.updatePartial({set:{ name: channelName, 
             }}, { text: `Channel name changed to ${channelName}`});
        }

        if(hotlineChanged) 
            await channel.updatePartial({set:{ hotline: isHotlineChannel}});
       

        if(selectedUsers.length) {
            await channel.addMembers(selectedUsers);
        }

        setChannelName(null);
        setIsEditing(false);
        setSelectedUsers([]);
    }
    const { client } = useChatContext();
    console.log(client);
    
    

    return (
        <div className="edit-channel__container">
            <div className="edit-channel__header">
                <p>Edit Channel</p>
                <CloseCreateChannel setIsEditing={setIsEditing} />
            </div>
            <ChannelNameInput channelName={channelName} 
                              setChannelName={setChannelName} 
                              isHotlineChannel={isHotlineChannel} 
                              setIsHotlineChannel={setIsHotlineChannel}/>
            <UserList setSelectedUsers={setSelectedUsers} />
            <div className="edit-channel__button-wrapper" onClick={updateChannel}>
                <p>Save Changes</p>
            </div>
        </div>
    )
}

export default EditChannel
