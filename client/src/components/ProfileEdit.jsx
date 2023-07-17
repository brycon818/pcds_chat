import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';


import Select, {setSelectedValues} from "react-select"

import { CloseEditProfile } from '../assets';
import { useChatContext } from "stream-chat-react/dist/context"    
import dotenv from "dotenv";

const cookies = new Cookies();   
    
const ProfileEdit = ({setIsEditingProfile}) => {
    const { client } = useChatContext();    
    
    const initialState = {
        fullName: client.user.fullName,
        username: client.user.name,
        password: '',
        confirmPassword: '',
        phoneNumber: client.user.phoneNumber,
        avatarURL: client.user.image,
        email: client.user.email
    }

    const [form, setForm] = useState(initialState);
    
    const [isSignup, setIsSignup] = useState(true);

    const teamOptions = [
        { value: 'GWA', label: 'GWA' },
        { value: 'GPA', label: 'GPA' },
        { value: 'MAUI', label: 'MAUI' },
        { value: 'KAUAI', label: 'KAUAI' },
        { value: 'GSWC', label: 'GSWC' },
        { value: 'PCDS', label: 'PCDS' },
      ];
   
    
    let initialOptions = [];
      
    for (let i = 0; i < client.user.teams.length; i++) {              
        initialOptions.push({value : client.user.teams[i], label : client.user.teams[i]});
    }
        
    const [selectedValues, setSelectedValues] = useState(initialOptions);
    
    
    const [selectedFile, setSelectedFile] = useState(null); //file for the avatar
    const [avatar, setAvatar] = useState(null); //stores actual filename of file on our server        
    
    var avatarFileName=null;

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value });
    };
    
    const handleSelectChange = (selectedOptions) => {
        setSelectedValues(selectedOptions);       
      };

      const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);             
      };
                 

    const onFileUpload = async () => {
        if (selectedFile===null)
           return;

        console.log('backend: ' + process.env.REACT_APP_BACKEND_URL);  
        const URL =  process.env.REACT_APP_BACKEND_URL + '/upload';
 
        // Create an object of formData
        const formData = new FormData();
 
        // Update the formData object
        formData.append(
            "file",
            selectedFile,
            selectedFile.name                       
        );
 
        // Details of the uploaded file
        console.log(selectedFile);
 
        // Request made to the backend api
        // Send formData object
       // axios.post(`${URL}`, formData);
        const response = await axios.post(`${URL}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });          
      
       setAvatar(response.data.filename);
       
       
       if (response.data.filename !== null)
          avatarFileName = '/avatars/' + response.data.filename;
       else 
          avatarFileName = client.user.avatarURL;          
       setSelectedFile(null);          
    };  

    /*const memberIdsRef =
      useRef<SelectInstance<{ label: string, value: string }>>(null)  ;*/

    const handleSubmit = async (e) => {
        e.preventDefault();

        //let { username, fullName, password, phoneNumber, avatarURL, email } = form;

        const URL = process.env.REACT_APP_BACKEND_URL + '/auth';
        //const URL = 'http://localhost:5000/auth';
        // const URL = 'https://medical-pager.herokuapp.com/auth';
        
        
        let userTeams = [];
        for (let i = 0; i < selectedValues.length; i++) {              
            userTeams.push(selectedValues[i].value);
        }

        const fullName1 = (form.fullName || client.user.fullName);
        const phoneNumber = (form.phoneNumber || client.user.phoneNumber);
        const email = (form.email || client.user.email);
        const avatarURL = (form.avatarURL || client.user.avatarURL);
        const password = (form.password || client.user.password);
        const username = client.user.name;

        await onFileUpload();

        try {
            const { data: { token, userId, password, fullName, role} } = await axios.post(`${URL}/${isSignup ? 'update' : 'login'}`, {
                username : client.user.name, password, fullName : fullName1, phoneNumber, image: avatarFileName, userTeams, email});

            cookies.set('token', token);
            cookies.set('username', username);
            cookies.set('fullName', fullName);
            cookies.set('userId', userId);
            cookies.set('role', role);
        

            if(isSignup) {
                cookies.set('phoneNumber', phoneNumber);
                cookies.set('avatarURL', avatarURL);
                cookies.set('hashedPassword', password);
            }

            window.location.reload();

        }
        catch (error){
          alert("Unable to Login, check username and password.")  
          console.error('Error BCC:', error);
        }
        
        
        
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
    }

    //auth__form-container_fields-content
    console.log('inside ProfileEdit.jsx');
    return (
        <div className="auth__form-container2">
            <div className="auth__form-container_fields bg-gray-100">
                <div className="auth__form-container_fields-content">
                    <div className="edit-channel__header">
                    <p>Edit Profile</p>                    
                    <CloseEditProfile  setIsEditingProfile={setIsEditingProfile} />                                        
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username">Username</label>
                                <input 
                                    name="username" 
                                    value={form.username}
                                    type="text"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    required
                                    readOnly={(client.user.role!=="admin")}
                                />
                        </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="fullName">Full Name</label>
                                <input 
                                    name="fullName" 
                                    value={form.fullName}
                                    type="text"
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}                        
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="email">E-mail Address</label>
                                <input 
                                    name="email" 
                                    type="text"
                                    placeholder="E-mail address"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="phoneNumber">Phone Number</label>
                                <input 
                                    name="phoneNumber" 
                                    type="text"
                                    placeholder="Phone Number"
                                    value={form.phoneNumber}
                                    onChange={handleChange}                                    
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="Teams">Teams</label>
                                <Select
                                   // ref={userTeamsref}
                                    name="userTeams"
                                    id="teams"
                                    required
                                    isMulti
                                    //classNames={{ container: () => "w-full" }}
                                    //isLoading={users.isLoading}
                                    onChange={handleSelectChange}
                                    value={selectedValues}
                                    options={teamOptions}
                                    />                                                                  
                            </div>
                        )}
                        
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="avatarURL">Avatar</label>
                                <input 
                                    name="avatarURL" 
                                    type="file"
                                    placeholder="Avatar"
                                    accept="image/*"
                                    onChange={handleFileSelect}                                    
                                />        
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                                <label htmlFor="password">Password</label>
                                <input 
                                    name="password" 
                                    type="password"
                                    placeholder="Password"
                                    onChange={handleChange}                                    
                                />
                            </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="confirmPassword">Confirm Password</label>
                                <input 
                                    name="confirmPassword" 
                                    type="password"
                                    placeholder="Confirm Password"
                                    onChange={handleChange}                                    
                                />
                            </div>
                            )}
                        <div className="auth__form-container_fields-content_button">
                            <button>{isSignup ? "Update Profile" : "Sign In"}</button>
                        </div>
                    </form>                    
                </div> 
            </div>            
        </div>
    )
}

export default ProfileEdit
