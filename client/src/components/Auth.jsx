import React, { useState, state} from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/signup.jpg';
import Select, { SelectInstance } from "react-select"
import dotenv from "dotenv";

dotenv.config();


const cookies = new Cookies();

const initialState = {
    fullName: '',
    username: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    avatarURL: '',
}


const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const [selectedValues, setSelectedValues] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null); //file for the avatar
    const [avatar, setAvatar] = useState(null); //stores actual filename of file on our server        
    
    var avatarFileName=null;
   
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    

    const handleSelectChange = (selectedOptions) => {
        setSelectedValues(selectedOptions);
      };

    const teamOptions = [
        { value: 'GWA', label: 'GWA' },
        { value: 'GPA', label: 'GPA' },
        { value: 'MAUI', label: 'MAUI' },
        { value: 'KAUAI', label: 'KAUAI' },
        { value: 'GSWC', label: 'GSWC' },
        { value: 'PCDS', label: 'PCDS' },
      ];

    /*const memberIdsRef =
      useRef<SelectInstance<{ label: string, value: string }>>(null)  ;*/

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, password, phoneNumber, avatarURL, email } = form;

        const URL = process.env.REACT_APP_BACKEND_URL + '/auth';
        //const URL = 'http://129.146.52.58:5000/auth';
        // const URL = 'https://medical-pager.herokuapp.com/auth';
        
        
        let userTeams = [];
        for (let i = 0; i < selectedValues.length; i++) {              
            userTeams.push(selectedValues[i].value);
        }
        
        if(isSignup) {
            await onFileUpload();  
            console.log("filename: " + avatarFileName);
        }

        try {
            const { data: { token, userId, hashedPassword, fullName, role} } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, {
                username, password, fullName: form.fullName, phoneNumber, 
                image: avatarFileName,
                userTeams, email});

            cookies.set('token', token);
            cookies.set('username', username);
            cookies.set('fullName', fullName);
            cookies.set('userId', userId);
            cookies.set('role', role);
        

            if(isSignup) {
                cookies.set('phoneNumber', phoneNumber);
                //cookies.set('avatarURL', avatarURL);
                cookies.set('hashedPassword', hashedPassword);
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
       
       
       console.log(response.data.filename);
       avatarFileName = '/avatars/' + response.data.filename;
       setSelectedFile(null);          
    };  

    return (
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>{isSignup ? 'Sign Up' : 'Sign In'}</p>
                    <form onSubmit={handleSubmit}>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="fullName">Full Name</label>
                                <input 
                                    name="fullName" 
                                    type="text"
                                    placeholder="Full Name"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username">Username</label>
                                <input 
                                    name="username" 
                                    type="text"
                                    placeholder="Username"
                                    onChange={handleChange}
                                    required
                                />
                        </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="email">E-mail Address</label>
                                <input 
                                    name="email" 
                                    type="email"
                                    placeholder="e-mail address"
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
                                    onChange={handleChange}                                    
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="Teams">Teams</label>
                                <Select
                                  //  ref={memberIdsRef}
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
                                    required
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
                                    required
                                />
                            </div>
                            )}
                        <div className="auth__form-container_fields-content_button">
                            <button>{isSignup ? "Sign Up" : "Sign In"}</button>
                        </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {isSignup
                             ? "Already have an account?" 
                             : "Don't have an account?"
                             }
                             <span onClick={switchMode}>
                             {isSignup ? 'Sign In' : 'Sign Up'}
                             </span>
                        </p>
                    </div>
                </div> 
            </div>
            <div className="auth__form-container_image">
                <img src={signinImage} alt="sign in" />
            </div>
        </div>
    )
}

export default Auth
