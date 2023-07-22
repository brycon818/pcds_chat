const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;


require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;

const signup = async (req, res) => {
    try {
        
        const { fullName, username, password, phoneNumber, userTeams, email, image } = req.body;

        //const userId = crypto.randomBytes(16).toString('hex');
        const userId = username;

        const serverClient = connect(api_key, api_secret, app_id);
        const streamChat = StreamChat.getInstance(
            api_key,
            api_secret 
          );

        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUsers = await streamChat.queryUsers({ id: userId })
        /*if (existingUsers.users.length > 0) {
            return res.status(400).send("User ID taken")
            }*/
        
        let userRole = '';

        if (existingUsers.users.length > 0) {
            userRole = existingUsers.users[0].role;
        }
        else {
            userRole = 'user';
        }
        
        if (userId==='pcds-admin') {
            userRole = 'admin';
        }
    
        await streamChat.upsertUser({ 
            id : userId, 
            role : userRole,         
            name : username, 
            fullName,
            password : hashedPassword,            
            email: email,
            phoneNumber : phoneNumber,
            teams : userTeams,    
            image: image        
        });
    
        const token = serverClient.createUserToken(userId);

        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber,  });
    } catch (error) {                
        console.log(error);

        res.status(500).json({ message: error });
    }
};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const serverClient = connect(api_key, api_secret, app_id);
        const client = StreamChat.getInstance(api_key, api_secret);

        const { users } = await client.queryUsers({ name: username });

        if(!users.length) return res.status(401).json({ message: 'User not found' });
        
        var success = false;
        if ((password!==null) && (password!=='') && 
            (users[0].password !== null) && (users[0].password !== undefined)){
           try {
                success = await bcrypt.compare(password, users[0].password);                
           } catch (error) {
               console.log("bcrypt error: " + error); }
        }
        var token = null;
        
        
        if (success) {            
            token = serverClient.createUserToken(users[0].id);
        }
        
        if(success) {            
            res.status(200).json({ token, fullName: users[0].fullName, username, userId: users[0].id, role: users[0].role});
        } else {
            res.status(401).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: error });
    }
};

const update = async (req, res) => {
    try {
        
        const { fullName, username, password, phoneNumber, userTeams, email, image } = req.body;
        
        
        const userId = username;

        const serverClient = connect(api_key, api_secret, app_id);
        const streamChat = StreamChat.getInstance(
            api_key,
            api_secret 
          );

        
        const existingUsers = await streamChat.queryUsers({ id: userId })
        if (existingUsers.users.length <= 0) {
            return res.status(400).send("User ID not found")
            }
                
        
        let userRole = existingUsers.users[0].role;
        
        
        if (userId==='pcds-admin') {
            userRole = 'admin';
        }
        
        let hashedPassword = '';
        
        if ((password===null) || (password==='')) {
            hashedPassword = existingUsers.users[0].hashedPassword;           
        }
        else {
           hashedPassword = await bcrypt.hash(password, 10);
        };
    
        await streamChat.upsertUser({ 
            id : userId, 
            role : userRole,                     
            fullName,
            password : hashedPassword,
            email: email,
            phoneNumber : phoneNumber,
            teams : userTeams,    
            image : image        
        });
    
        const token = serverClient.createUserToken(userId);

        res.status(200).json({ token, fullName, username, userId, hashedPassword, phoneNumber,  });
    } catch (error) {                
        console.log(error);

        res.status(500).json({ message: error });
    }
};

module.exports = { signup, login, update }