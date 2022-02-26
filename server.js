const express = require('express')
const app= express()
const server = require('http').Server(app)
const port = process.env.PORT || 3031
const cors = require("cors");


app.use(cors());


const io = require('socket.io')(server,{
    cors:{
        origin: "*",
        methods: ["GET","POST"],
    }
})
const { ExpressPeerServer } = require('peer')
const peerServer = ExpressPeerServer(server,{
    debug: true
})

app.use('/',(req,res)=>{
    res.status(200).send("Welcome to our Stream server Cool 😎🔥🔥🔥")
})

io.on('connection', socket => {
  
    socket.on('join-room', (roomId, userId) => {
      console.log("user "+userId+ " joined room "+roomId)
      socket.join(roomId)
      socket.broadcast.to(roomId).emit('user-connected', userId);


      socket.on("sendMessage",(data)=>{
        // here we gonna emit event to  the front to evrey one in the room
        
        socket.to(data.room).emit("reciveMessage",data)
       
     })

      socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('user-disconnected', userId)
      })
   
    })



  })
  


server.listen(port,()=>{
  console.log('Stream sever running at port '+port)
})

