import { useNavigate } from "react-router-dom"
import { ChannelInfo } from '../assets';
import {
    LoadingIndicator,
    Chat,
    ChannelList,
    Channel,
    Window,
    MessageInput,
    MessageList,
    ChannelHeader,
    Thread,
    ChannelPreviewUIComponentProps,  
    Avatar,
    useChannelStateContext,
    ChannelHeaderProps,
    VirtualizedMessageList
  } from "stream-chat-react"
  
  import { useChatContext } from "stream-chat-react/dist/context"    
  
  
  import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
  } from "react"
  
export function CustomChannelHeader  (props) {
    const { title, setIsEditing } = props;
    //const navigate = useNavigate()
  
    const { channel, watcher_count } = useChannelStateContext();
    const { name } = channel.data || {};  
    const { client } = useChatContext();
    
    
              
  
    const getWatcherText = (watchers) => {
      if (!watchers) return 'No users online';
      if (watchers === 1) return (channel?.data?.type==="team" ?'1 online' : 'Offline');
      if (watchers === 2) return (channel?.data?.type==="team" ?'2 online' : 'Online');
      return `${watchers} online`;
    };
  
    const [clicked, setClicked] = useState(false);
    
    const handleClick = () => {
      setClicked(!clicked);
    };
  
    
   if (channel?.data?.type==="team") {
      let members = Object.values(channel.state.members)
      
      return (
        <div className='str-chat__header-livestream'>
          <div className="block">
          <div>
          <button
              className="flex channelHeader_main pt-2 pb-2 bg-gray-200"
              onClick={handleClick}
          >
              <div>
                  <img
                    src="/icons8-hashtags-64.png"
                          className="w-10 h-10 rounded-full object-center object-cover bg-blue-200"
                    alt=""      
                  />           
              </div>
              <div className="pl-2 block">
                  <div className="flex text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                        {title || name}               
                  </div>   
                  <div className='flex text-sm'>
                      {members.length} members, {getWatcherText(watcher_count)}
                  </div>                   
              </div>                    
          </button>
          </div>
          {clicked && (
             <div className="text-sm pt-2">
                <ul >
                  <li className="font-bold flex">Channel Members:      
                            
                  </li>
                  {members.map((member) => (
                    <li key={member?.user?.name}>                   
                    <span>{(member?.user?.fullName || member?.user?.name) } - </span>
                    <span className = {member?.user?.online ? "text-green-600" : "text-red-500"}>{member?.user?.online ? 'Online' : 'Offline'}</span>                  
                  </li>                  
                  ))}
                  {(client.user.role==='admin') && (
                  <div>                                  
                    <button onClick={() => setIsEditing(true)}>Add Members</button>
                  </div>              
                  )}        
        </ul>   
  
             </div>
          )
          }
          </div>
        </div>
      );
   }
   else {
      let channelName = channel.data?.name
      let imageSource = "";
             
      
      let members = Object.values(channel.state.members).filter(({ user }) => user?.id !== client?.user?.id)
      
      channelName =  members[0]?.user?.fullName || members[0]?.user?.name || members[0]?.user?.id 
      imageSource = members[0]?.user?.image;
             
  
    return (
      <div className='str-chat__header-livestream'>
        <div
          className="pl-2 pt-2 pb-2 w-full bg-gray-200 inline-flex flex-row items-center"
        ><div>        
            <img
                src={imageSource || "/icons8-customer-32.png"}
                className="w-10 h-10 rounded-full object-center object-cover"
                alt=""                      
            />
                  </div>
                   <div className='pl-2'>
                  <div className="text-sm font-bold text-ellipsis overflow-hidden whitespace-nowrap">
                    {channelName || channel.id}                  
                  </div>   
          <div className='text-sm'>
            {getWatcherText(watcher_count)}
          </div> </div>
      </div>
      </div>
    );
   }
  };