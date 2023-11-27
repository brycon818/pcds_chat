import React, { useState, useEffect} from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelSearch, TeamChannelList, TeamChannelPreview, ProfileEdit } from './';
import PCDS_Logo from '../assets/pcds_logo_square.png'
import LogoutIcon from '../assets/logout.png'
import ProfileEditIcon from '../assets/profile_edit.png'
import { Link } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';


const cookies = new Cookies();




const SideBar = ({ logout, setIsEditingProfile, setShowConfirm }) => (    
    <div className="channel-list__sidebar">
        <div className="channel-list__sidebar__icon1">
            <div className="icon1__inner">
                <img src={PCDS_Logo} alt="Logo" width="40" />
            </div>
        </div>                
        <div className="channel-list__sidebar__icon2">                 
            <div className="icon1__inner" onClick={() => setIsEditingProfile(true)} >
                <img src={ProfileEditIcon} alt="Edit Profile" width="40" title="Edit Your Profile" />
            </div>
        </div>      
        <div className="channel-list__sidebar__icon2">              
            <div className="icon1__inner" onClick={()=>setShowConfirm(true)}>
                <img src={LogoutIcon} alt="Logout" width="25" title="Logout" />
            </div>
        </div> 
    </div>
);

const CompanyHeader = () => (
    <div className="channel-list__header">
        <p className="channel-list__header__text">Prithibi Consulting and Development Services</p>
    </div>
)

const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team');
}

const customChannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging');
}



const ChannelListContent = ({ isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer, setIsEditingProfile, setShowConfirm }) => {
    const { client } = useChatContext();
    

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
            cookies.remove('role');

            window.location.reload();
        }
    }

    const editProfile = () => {
        
        return (<div className="app__wrapper">Hello World!
                <div>
                 <ProfileEdit />
                 </div>
        </div>);
                
    }

    const filters = { members: { $in: [client.userID] } };
       

    return (
        <>
            <SideBar logout={logout} 
                     setIsEditingProfile={setIsEditingProfile} 
                     setShowConfirm={setShowConfirm}/>
            <div className="channel-list__list__wrapper">
                <CompanyHeader />
                <ChannelSearch setToggleContainer={setToggleContainer} />
                <ChannelList 
                    filters={filters}
                    channelRenderFilterFn={customChannelTeamFilter}
                    List={(listProps) => (
                        <TeamChannelList 
                            {...listProps}
                            type="team"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType} 
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview 
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                            type="team"
                        />
                    )}
                    sendChannelsToList
                />
                <ChannelList 
                    filters={filters}
                    channelRenderFilterFn={customChannelMessagingFilter}
                    List={(listProps) => (
                        <TeamChannelList 
                            {...listProps}
                            type="messaging"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType} 
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview 
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                            type="messaging"
                        />
                    )}
                    sendChannelsToList
                />
            </div>
        </>
    );
}

const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing, setIsEditingProfile }) => {
    const [toggleContainer, setToggleContainer] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);  
    
    const handleConfirm = () => {
        // Perform the action to be taken on confirmation
        console.log('Confirmed!');
        setShowConfirm(false);
        logout();
      };
    
    const handleCancel = () => {
        // Perform the action to be taken on cancellation
        console.log('Cancelled!');
        setShowConfirm(false);      
      };

    const logout = () => {
        //const confirmed = window.confirm('Are you sure you want to log out?');
        
        //if (confirmed) {

            cookies.remove("token");
            cookies.remove('userId');
            cookies.remove('username');
            cookies.remove('fullName');
            cookies.remove('avatarURL');
            cookies.remove('hashedPassword');
            cookies.remove('phoneNumber');
            cookies.remove('role');

            window.location.reload();
        //}
    }

    return (
        <>
            <div className="channel-list__container">
              <ChannelListContent 
                setIsCreating={setIsCreating} 
                setCreateType={setCreateType} 
                setIsEditing={setIsEditing} 
                setIsEditingProfile={setIsEditingProfile}
                setShowConfirm={setShowConfirm}
              />
            </div>

            <div className="channel-list__container-responsive"
                style={{ left: toggleContainer ? "0%" : "-89%", backgroundColor: "#005fff"}}
            >
                <div className="channel-list__container-toggle" onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}>
                </div>
                <ChannelListContent 
                setIsCreating={setIsCreating} 
                setCreateType={setCreateType} 
                setIsEditing={setIsEditing}
                setIsEditingProfile={setIsEditingProfile}
                setToggleContainer={setToggleContainer}
                setShowConfirm={setShowConfirm}
              />
            </div>
            { (showConfirm) && (
                    <ConfirmModal
                        isOpen={showConfirm}
                        message="Are you sure you want to logout?"
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />)
            }
        </>
    )

}

export default ChannelListContainer;
