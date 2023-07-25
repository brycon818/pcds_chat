import React, {useState, useEffect} from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';



const TeamChannelPreview = ({ setActiveChannel, setIsCreating, setIsEditing, setToggleContainer, channel, type }) => {
    const { channel: activeChannel, client } = useChatContext();
    const [count, setCount] = useState(0);
    const [newMessageCount, setNewMessageCount] = useState(0);
        
    useEffect(() => {
        var timerID = setInterval(() => {
            setNewMessageCount(channel.state.unreadCount);
        }, 2000);
     
        return () => clearInterval(timerID);
      },[]);

    const ChannelPreview = () => {
        /*var unreadCount = "";
        if ((channel.state.unreadCount > 0) && (channel.state.unreadCount < 10))
           unreadCount = channel.state.unreadCount;
        else if ((channel.state.unreadCount > 0) && (channel.state.unreadCount > 10))
           unreadCount = "9+";                   */

           var unreadCount = "";
           if ((newMessageCount > 0) && (newMessageCount < 10))
              unreadCount = newMessageCount;
           else if ((newMessageCount > 0) && (newMessageCount > 10))
              unreadCount = "9+";                             
        

        

        return (
        <div className="channel-preview__item">
            { (unreadCount !=="" ) ?
        <button data-count = {unreadCount}
            onClick={() => {                
                unreadCount = "";              
                setCount(count+1);                      
               }}  
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
        )
    };


    const DirectPreview = () => {
        const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
                

            var unreadCount = "";
            if ((newMessageCount > 0) && (newMessageCount < 10))
               unreadCount = newMessageCount;
            else if ((newMessageCount > 0) && (newMessageCount > 10))
               unreadCount = "9+";          
        

        return (
            <div className="flex channel-preview__item  ">
                <div className={members[0].user.online ? "border-green" : "border-red"}>
                <Avatar 
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.fullName || members[0]?.user?.id}
                    size={24}
                    className = "border-green"
                /></div>
                { (unreadCount !=="" ) ?
        <button data-count = {unreadCount}
               className="button26"
               onClick={() => {
                unreadCount = "";              
                setCount(count+1);                
               }}  
               >
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
            setCount(1); 
            setIsCreating(false);
            setIsEditing(false);                       
            setActiveChannel(channel);             
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
