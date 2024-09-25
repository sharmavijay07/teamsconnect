const express = require("express");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");

const app = express();
const PORT = process.env.PORT || 4500;

const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");
const messageRoute = require("./routes/messageRoute");
const uploadRoute = require("./routes/uploadRoute"); // Add this line
const videoRoute = require("./routes/videoRoute");
const voiceRoute = require("./routes/voiceUploadRoute");

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files from the uploads directory

app.use("/api/users", userRoute);
app.use("/api/chat", chatRoute);
app.use("/api/messages", messageRoute);
app.use("/api/upload", uploadRoute); // Ensure this line is included to use the upload route
app.use("/api/upload-voice", voiceRoute);
app.use("/api/video", videoRoute);

app.get("/", (req, res) => {
  res.send("Welcome to our chat app APIs");
});

var _userConnections = [];

// Socket.io setup
const io = new Server(
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  }),
  {
    cors: {
      origin: "http://localhost:5173", // Change this to your frontend's URL
      methods: ["GET", "POST"],
    },
  }
);

let onlineUsers = [];

function getCurrDateTime() {
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  var dt =
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;
  return dt;
}

io.on("connection", (socket) => {
  console.log("new connection", socket.id);

  // Listen for a new user
  socket.on("addNewUser", (userId) => {
    if (!onlineUsers.some((user) => user.userId === userId)) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
    console.log("OnlineUsers", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  // Listen for messages
  socket.on("sendMessage", (message) => {
    console.log("message in sendMessage", message);
    const user = onlineUsers.find(
      (user) => user.userId === message.recipientId
    );
    if (user) {
      io.to(user.socketId).emit("getMessages", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date(),
      });
    }
  });

  // Socket.io server code

  socket.on("sendMessageMeeting", (msg) => {
    const { from, text } = msg;
    // Broadcast the message to all users in the meeting
    socket.to(msg.meetingId).emit("showChatMessage", { from, text });
  });

  socket.on("userconnect", (data) => {
    console.log("userconnect", data.dsiplayName, data.meetingid);

    var other_users = _userConnections.filter(
      (p) => p.meeting_id == data.meetingid
    );

    _userConnections.push({
      connectionId: socket.id,
      user_id: data.dsiplayName,
      meeting_id: data.meetingid,
    });
    var userCount = _userConnections.length;
    console.log(userCount);
    other_users.forEach((v) => {
      socket.to(v.connectionId).emit("informAboutNewConnection", {
        other_user_id: data.dsiplayName,
        connId: socket.id,
        userNumber: userCount,
      });
    });

    socket.emit("userconnected", other_users);
    //return other_users;
  }); //end of userconnect

  socket.on("exchangeSDP", (data) => {
    socket.to(data.to_connid).emit("exchangeSDP", {
      message: data.message,
      from_connid: socket.id,
    });
  }); //end of exchangeSDP

  socket.on("reset", (data) => {
    var userObj = _userConnections.find((p) => p.connectionId == socket.id);
    if (userObj) {
      var meetingid = userObj.meeting_id;
      var list = _userConnections.filter((p) => p.meeting_id == meetingid);
      _userConnections = _userConnections.filter(
        (p) => p.meeting_id != meetingid
      );

      list.forEach((v) => {
        socket.to(v.connectionId).emit("reset");
      });

      socket.emit("reset");
    }
  }); //end of reset

  socket.on("sendMessage", (msg) => {
    console.log(msg);
    var userObj = _userConnections.find((p) => p.connectionId == socket.id);
    if (userObj) {
      var meetingid = userObj.meeting_id;
      var from = userObj.user_id;

      var list = _userConnections.filter((p) => p.meeting_id == meetingid);
      console.log(list);

      list.forEach((v) => {
        socket.to(v.connectionId).emit("showChatMessage", {
          from: from,
          message: msg,
          time: getCurrDateTime(),
        });
      });

      socket.emit("showChatMessage", {
        from: from,
        message: msg,
        time: getCurrDateTime(),
      });
    }
  }); //end of reset

  socket.on("fileTransferToOther", function (msg) {
    console.log(msg);
    var userObj = _userConnections.find((p) => p.connectionId == socket.id);
    if (userObj) {
      var meetingid = userObj.meeting_id;
      var from = userObj.user_id;

      var list = _userConnections.filter((p) => p.meeting_id == meetingid);
      console.log(list);

      list.forEach((v) => {
        socket.to(v.connectionId).emit("showFileMessage", {
          from: from,
          username: msg.username,
          meetingid: msg.meetingid,
          FileePath: msg.FileePath,
          fileeName: msg.fileeName,
          time: getCurrDateTime(),
        });
      });
    }
  });
  socket.on("disconnect", function () {
    console.log("Got disconnect!");

    var userObj = _userConnections.find((p) => p.connectionId == socket.id);
    if (userObj) {
      var meetingid = userObj.meeting_id;

      _userConnections = _userConnections.filter(
        (p) => p.connectionId != socket.id
      );
      var list = _userConnections.filter((p) => p.meeting_id == meetingid);

      list.forEach((v) => {
        var userCou = _userConnections.length;
        socket.to(v.connectionId).emit("informAboutConnectionEnd", {
          connId: socket.id,
          userCoun: userCou,
        });
      });
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});
