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
    VirtualizedMessageList,
    useChannelActionContext,     
  } from "stream-chat-react"
  
  import { useChatContext } from "stream-chat-react/dist/context"    
  
  
  import {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
  } from "react"

  import LogoutIcon from '../assets/logout.png'
  import ProfileEditIcon from '../assets/profile_edit.png'
  import { ProfileEdit, ChannelContainer } from './';

  import Cookies from 'universal-cookie';

  const cookies = new Cookies();
  
export function CustomChannelHeader  (props) {
    const { title, setIsEditing, setIsEditingProfile } = props;
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
    const [isRemovingMember, setIsRemovingMember] = useState(false);

    const removeUser = async (channelId, userId) => {
      
      setIsRemovingMember(true);
      try {
        await channel.removeMembers([userId]);
      } catch (error) {
        console.error(error);
      } finally {      
        setIsRemovingMember(false);
      }
    };

    const [isCreatingDM, setIsCreatingDM] = useState(false);

    const createDM = async (userId) => {      
      
      setIsCreatingDM(true);
      try {
        const newChannel =  client.channel("messaging", userId, {
          name: userId, members: [userId,client.userID], 
        });

        await newChannel.watch();
      } catch (error) {
        console.error(error);
      } finally {        
        setIsCreatingDM(false);
      }
    };

    const logout = () => {
      const confirmed = window.confirm('Are you sure you want to log out?');
      
      if (confirmed) {

          cookies.remove("token");
          cookies.remove('userId');
          cookies.remove('username');
          cookies.remove('fullName');
          cookies.remove('avatarURL');
          cookies.remove('hashedPassword');
          cookies.remove('phoneNumber');

          window.location.reload();
      }
    }
    
    const [page, setPage] = useState("profile");

    const editProfile = () => {                    
            
            
      return (
               <ChannelContainer 
                  isEditingProfile={true}
               />
              );
              
    }
  
    
   if (channel?.data?.type==="team") {
      let members = Object.values(channel.state.members)
    
      return (
        <div className='str-chat__header-livestream'>
          <div className="block">
          <div>
          <div
              className="flex channelHeader_main pt-2 pb-2 pr-2 bg-gray-200"
              
          >                  
              <div>
                  <img
                    src="/icons8-hashtags-64.png"
                          className="w-10 h-10 rounded-full object-center object-cover bg-blue-200"
                    alt=""      
                  />           
              </div>
              <div className="pl-2 block ">
                  <div className="flex text-sm font-semibold text-ellipsis overflow-hidden whitespace-nowrap">
                        {title || name}               
                  </div>   
                  
                  <div className='flex text-sm cursor_pointer'
                       onClick={handleClick}>
                      {members.length} members, {getWatcherText(watcher_count)}
                  </div>                              
              </div> 
              <div className="flex ml-auto">
              <div className="logout_button__icon3">
                 <div className="icon1__inner" onClick={() => setIsEditingProfile(true)} >
                    <img src={ProfileEditIcon} alt="Edit Profile" width="40" />
                </div>
              </div>
              <div className="logout_button__icon3">              
                <div className="icon1__inner" onClick={logout}>
                    <img src={LogoutIcon} alt="Logout" width="25" />
                </div>
            </div>                          
          </div>     
          </div>
          </div>
          {clicked && (
             <div className="text-sm pt-2 pb-2 bg-gray-200">
                <ul >
                  <li className="font-bold flex">Channel Members:      
                            
                  </li>
                  {members.map((member) => (
                    <li key={member?.user?.name}>                   
                    <span>{(member?.user?.fullName || member?.user?.name) } - </span>
                    <span className = {member?.user?.online ? "text-green-600" : "text-red-500"}>{member?.user?.online ? 'Online' : 'Offline'}</span>
                    
                    { (client.userID!==member.user.id) && 
                        (<button className = "remove_member"
                               onClick = {(e) => {
                                removeUser(`${channel.data.id}`, `${member.user.id}`);
                               }}
                        > Remove
                        </button>)                 
                    }
                    { (client.userID!==member.user.id) && 
                        (<button className = "remove_member"
                               onClick = {(e) => {
                                createDM(`${member.user.id}`);
                               }}
                        > Message
                        </button>)                 
                    }
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
          <div className="flex ml-auto">
              <div className="logout_button__icon3">
                 <div className="icon1__inner" onClick={() => setIsEditingProfile(true)} >
                    <img src={ProfileEditIcon} alt="Edit Profile" width="40" />
                </div>
              </div>
              <div className="logout_button__icon3">              
                <div className="icon1__inner" onClick={logout}>
                    <img src={LogoutIcon} alt="Logout" width="25" />
                </div>
            </div>                          
          </div>    
      </div>
      
      </div>
    );
   }
  };