import React, {useState} from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

const TeamChannelPreview = ({ setActiveChannel, setIsCreating, setIsEditing, setToggleContainer, channel, type }) => {
    const { channel: activeChannel, client } = useChatContext();
    const [count, setCount] = useState(0);
    
    let unreadCount = "";
    if ((channel.state.unreadCount > 0) && (channel.state.unreadCount < 10))
       unreadCount = channel.state.unreadCount;
    else if ((channel.state.unreadCount > 0) && (channel.state.unreadCount > 10))
       unreadCount = "9+";
          

    const ChannelPreview = () => (
        <div className="channel-preview__item">
            { (channel.state.unreadCount > 0 ) ?
        <button data-count = {unreadCount}
               className={channel.data.hotline == "1" ? "button29" : "button26"}               
               >
            # {channel?.data?.name || channel?.data?.id}                  
        </button>  :
           <button
              className={channel.data.hotline == "1" ? "button28" : "button27"}>
           # {channel?.data?.name || channel?.data?.id}                  
           </button>  
        }
        </div>
    );


    const DirectPreview = () => {
        const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
        
        let unreadCount = "";
        if ((channel.state.unreadCount > 0) && (channel.state.unreadCount < 10))
            unreadCount = channel.state.unreadCount;
        else if ((channel.state.unreadCount > 0) && (channel.state.unreadCount > 10))
            unreadCount = "9+";

        return (
            <div className="flex channel-preview__item ">
                <Avatar 
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.fullName || members[0]?.user?.id}
                    size={24}
                />
                { (channel.state.unreadCount > 0 ) ?
        <button data-count = {unreadCount}
               className="button26">
            {members[0]?.user?.fullName || members[0]?.user?.id}                 
        </button>  :
           <button
              className="button27 ">
           {members[0]?.user?.fullName || members[0]?.user?.id}                  
           </button>  
        }                
            </div>
        )
    }

    return (
        <div className={
            channel?.id === activeChannel?.id
                ? 'channel-preview__wrapper__selected'
                : 'channel-preview__wrapper'
        }
        onClick={() => {
            setIsCreating(false);
            setIsEditing(false);
            setActiveChannel(channel);
            setCount(count + 1);
            if(setToggleContainer) {
                setToggleContainer((prevState) => !prevState)
            }
        }}
        >
            {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
        </div>
    );
}

export default TeamChannelPreview
