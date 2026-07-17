import { Server } from "socket.io";

let connections = {};
let message = {};
let timeOnline = {};

export const connectToSocket = (server) => {
  const io = new Server(server,{
    cors:{
      origin:"*",
      methods: ["GET","POST"],
      allowedHeaders:["*"],
      credentials:true
    }
  });

  io.on("connection", (socket) => {
    

    socket.on("join-call", (path) => {
      if (connections[path] === undefined) {
        connections[path] = [];
      }
      connections[path].push(socket.id);
      timeOnline[socket.id] = new Date();

      for (let a = 0; a < connections[path].length; i++) {
        io.to(connections[path][a]).emit("user-joined", socket.id);
      }
    });

    socket.on("signal", (toId, message) => {
      io.to(toId).emit("signal", socket.id, message);
    });

    socket.on("chat-message", (data, sender) => {

      let matchingRoom = "";
      for (const roomKey in connections) {
        if (connections[roomKey].includes(socket.id)) {
          matchingRoom = roomKey;
          break;
        }
      }

      if (matchingRoom !== "") {
        if (message[matchingRoom] === undefined) {
          message[matchingRoom] = [];
        }

        message[matchingRoom].push({
          sender: sender,
          data: data,
          "socket-id-sender": socket.id,
        });

        console.log("message", matchingRoom, ":", sender, data);

        connections[matchingRoom].forEach((e) => {
          io.to(e).emit("chat-message", data, sender, socket.id);
        });
      }

      socket.on("disconnect", () => {

        //1) Remove user from room 

        // find room 
        let matchingRoom = "";
        for (const roomKey in connections) {
            if (connections[roomKey].includes(socket.id)) {
            matchingRoom = roomKey;
            break;
            }
        }

        // remove user from the room -> filter 
        connections[matchingRoom] = connections[matchingRoom].filter((id)=> id !== socket.id );

        // notify , user left 
        connections[matchingRoom].forEach((e)=>{
            io.to(e).emit("user-left", socket.id);
        });

        // Remove online time 
        delete timeOnline[socket.id];

        // Delete Empty Room
        if(connections[matchingRoom].length === 0){
            delete connections[matchingRoom];
        }

      });
    });
  });

  return io;
};
