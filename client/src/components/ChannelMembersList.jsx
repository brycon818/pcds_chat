import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext, useChannelStateContext } from 'stream-chat-react';

import { InviteIcon } from '../assets';

const ListContainer = ({ children }) => {
    return (
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Add</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user, setSelectedUsers }) => {
    const [selected, setSelected] = useState(false)

    const handleSelect = () => {
        if(selected) {
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        } else {
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }

        setSelected((prevSelected) => !prevSelected)
    }

    return (
        <div className="user-item__wrapper" onClick={handleSelect}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
                <p className="user-item__name">{user.fullName || user.id}</p>
            </div>
            {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
        </div>
    )
}


const ChannelMembersList = ({ setSelectedUsers }) => {
    const { client } = useChatContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false);
    const [error, setError] = useState(false);
    const { channel } = useChannelStateContext();

    useEffect(() => {
        const getUsers = async () => {
            if(loading) return;

            setLoading(true);           
            let filteredUsers = [];
            try {
                const allUsers = await client.queryUsers(
                     { id: { $ne: client.userID } },
                      { id: 1 },                    
                      //{ limit: 8 }                    
                );                                
                                                                              
               for (let i = 0; i < allUsers.users.length; i++) {                      
                    if (allUsers.users[i].teams !== undefined)  {                        
                        const userTeams = allUsers.users[i].teams;                                                
                        if (userTeams !== null) {                            
                            for (let j = 0; j < userTeams.length; j++) {                                                                  
                                if (client.user.teams !== undefined) 
                                    if (client.user.teams !== null)
                                        if (client.user.teams.includes(userTeams[j])) {
                                             filteredUsers.push(allUsers.users[i]);                                                                                             
                                             break;                                             
                                        }
                            }
                        }
                    }                    
                }
                      
                //const Members = Object.values(channel.state.members);
                
                const response = filteredUsers;
                

                if(response.length) {
                    setUsers(response);
                } else {
                    setListEmpty(true);
                }
            } catch (error) {
                console.log(error);
               setError(true);
            }
            setLoading(false);
        }

        if(client) getUsers()
    }, []);

    if(error) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    Error loading, please refresh and try again.
                </div>
            </ListContainer>
        )
    }

    if(listEmpty) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    No users found.
                </div>
            </ListContainer>
        )
    }

    return (
        <ListContainer>
            {loading ? <div className="user-list__message">
                Loading users...
            </div> : (
                users?.map((user, i) => (
                  <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />  
                ))
            )}
        </ListContainer>
    )
}

export default ChannelMembersList;