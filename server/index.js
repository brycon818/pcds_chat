const express = require('express');
const cors = require('cors');

const authRoutes = require("./routes/auth.js");

const app = express();
const PORT = process.env.PORT || 5000;

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
const twilioClient = require('twilio')(accountSid, authToken);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded() );

const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: '../client/public/avatars/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const fileName = file.originalname.replace(ext, '') + '-' + uniqueSuffix + ext;
      cb(null, fileName);
    }
});

const upload = multer({ storage });
  
//{extended: true}

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.post('/', (req, res) => {
    const { message, user: sender, type, members } = req.body;

    if(type === 'message.new') {
        members
            .filter((member) => member.user_id !== sender.id)
            .forEach(({ user }) => {
                if(!user.online) {
                    twilioClient.messages.create({
                        body: `You have a new message from ${message.user.fullName} - ${message.text}`,
                        messagingServiceSid: messagingServiceSid,
                        to: user.phoneNumber
                    })
                        .then(() => console.log('Message sent!'))
                        .catch((err) => console.log(err));
                }
            })

            return res.status(200).send('Message sent!');
    }

    return res.status(200).send('Not a new message request');
});

app.use('/auth', authRoutes);

app.post('/upload', upload.single('file'), (req, res) => {
    // Handle the uploaded file
    const file = req.file;
    
    if (!file) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }
  
    // Return a success response
    res.json({ message: 'File uploaded successfully.',
               filename: file.filename });
  });
  

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));