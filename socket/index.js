// const {Server, Socket} = require('socket.io')


// const io = new Server({
//     cors: {
//         origin: "http://localhost:5173",
//         methods: ["GET", "POST"]
//     }
// });
// let onlineUsers = []
// io.on("connection",(socket) => {
//     console.log("new connection",socket.id)

//     //listen to a connection
//     socket.on("addNewUser",(userId) => {
//         !onlineUsers.some((user)=>user.userId ===userId) &&
//         onlineUsers.push({
//             userId,
//             socketId:socket.id
//         })
//         console.log("OnlineUsers",onlineUsers)
        
//         io.emit("getOnlineUsers",onlineUsers)
//     }) 

//     //add messages
//     socket.on("sendMessage",(message) => {
//         console.log("message in sendMessage",message)
       
//         const user = onlineUsers.find(user => user.userId === message.recipientId)
//         console.log("user",user)
//         if(user) {
           
//             io.to(user.socketId).emit("getMessages",message)

//             io.to(user.socketId).emit("getNotification",{
//                 senderId: message.senderId,
//                 isRead: false,
//                 date:new Date()
//             })
//         }
//     })
    
//     socket.on("disconnect",() => {
//         onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id)

//         io.emit("getOnlineUsers",onlineUsers)
//     })
    
// })

// io.listen(3000)








const { Server, Socket } = require('socket.io');

const io = new Server({
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

let onlineUsers = [];

io.on("connection", (socket) => {
    console.log("new connection", socket.id);

    // Listen to a connection
    socket.on("addNewUser", (userId) => {
        !onlineUsers.some((user) => user.userId === userId) &&
        onlineUsers.push({
            userId,
            socketId: socket.id
        });
        console.log("OnlineUsers", onlineUsers);
        
        io.emit("getOnlineUsers", onlineUsers);
    });

    // Add messages
    socket.on("sendMessage", (message) => {
        console.log("message in sendMessage", message);
       
        const user = onlineUsers.find(user => user.userId === message.recipientId);
        console.log("user", user);
        if (user) {
            io.to(user.socketId).emit("getMessages", message);

            io.to(user.socketId).emit("getNotification", {
                senderId: message.senderId,
                isRead: false,
                date: new Date()
            });
        }
        io.to(socket.id).emit("getMessages", message);
    });

    // Video conference events
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room ${roomId}`);
    });

    socket.on("leaveRoom", (roomId) => {
        socket.leave(roomId);
        console.log(`Socket ${socket.id} left room ${roomId}`);
    });

    socket.on("offer", (data) => {
        io.to(data.receiver).emit("offer", data.offer);
    });

    socket.on("answer", (data) => {
        io.to(data.receiver).emit("answer", data.answer);
    });

    socket.on("ice-candidate", (data) => {
        io.to(data.receiver).emit("ice-candidate", data.candidate);
    });

    socket.on("disconnect", () => {
        onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onlineUsers);
    });
});

io.listen(3000);
