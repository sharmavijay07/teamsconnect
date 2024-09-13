const express = require('express');
const cors = require('cors');
const app = express();
const userRoute = require('./routes/userRoute');
const chatRoute = require('./routes/chatRoute');
const messageRoute = require('./routes/messageRoute');
const uploadRoute = require('./routes/uploadRoute'); // Add this line

const PORT = process.env.PORT || 4500;


app.use(express.json());
app.use(cors());
app.use(express.static('uploads')); // Serve static files from the uploads directory

app.use('/api/users', userRoute);
app.use('/api/chat', chatRoute);
app.use('/api/messages', messageRoute);

app.use('/api/upload', uploadRoute); // Ensure this line is included to use the upload route

app.get('/', (req, res) => {
    res.send("Welcome to our chat app APIs");
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
