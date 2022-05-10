const express = require("express")
const mongoose = require("mongoose");
const Rooms = require("./dbRoom");
const cors = require("cors");
const Messages = require("./dbMessages");
const Pusher = require("pusher");

const app = express();

app.use(express.json())
app.use(cors())

const pusher = new Pusher({
    appId: "1407459",
    key: "19062e592b077a66fc46",
    secret: "f7bb6695ff0ca38b12ca",
    cluster: "ap2",
    useTLS: true
  });

const dbUrl = "mongodb+srv://kiruba:kiruba_1997@streamingapps.xbvbb.mongodb.net/whatsappclones?retryWrites=true&w=majority"
mongoose.connect(dbUrl)
const db = mongoose.connection

db.once("open", ()=> {
    console.log("DB connected...")

    const roomCollection = db.collection("rooms");
    const changeStream = roomCollection.watch();

    changeStream.on("change", (change) => {
        console.log(change)
        if(change.operationType === "insert"){
            const roomDetails = change.fullDocument 
            pusher.trigger("room", "inserted", roomDetails)
        }
        else
        {
            console.log("Not expected even to trigger")
        }
    })

    const msgCollection = db.collection("messages");
    const changeStream1 = msgCollection.watch();

    changeStream1.on("change", (change) => {
        if(change.operationType === "insert"){
            const messageDetails = change.fullDocument 
            pusher.trigger("messages", "inserted", messageDetails)
        }
        else
        {
            console.log("Not expected even to trigger")
        }
    })
})


app.get("/", (req, res) => {
    res.send("Hello from backend")
})

app.post("/messages/new", (req, res)=> {
    const dbMessage = req.body;
    Messages.create(dbMessage, (err, data) => {
        if(err) {
            return res.status(500).send(err)
        }
        else
        {
            return res.status(201).send(data)
        }
    })
})

app.post("/group/create", (req, res) => {
    const name = req.body.groupName
    Rooms.create({name}, (err, data) => {
        if(err) {
            return res.status(500).send(err)
        }
        else
        {
            return res.status(201).send(data)
        }
    })
})

app.get("/all/rooms", (req, res) =>{
    Rooms.find({}, (err, data) => {
    if(err) {
        return res.status(500).send(err)
    }
    else{
        return res.status(200).send(data)
    }
  })
})


app.get("/room/:id", (req, res) => {
    Rooms.find({_id : req.params.id}, (err, data)=> {
        if(err){
            return res.status(500).send(err)
        } else {
            return res.status(200).send(data[0])
        }
    })
})

app.get("/messages/:id", (req, res)=>{
    Messages.find({roomId : req.params.id}, (err, data)=>{
       if(err){
          return res.status(500).send(err)
       }else{
          return res.status(200).send(data)
     }
   })
})

app.listen(7000, ()=>{
    console.log("Server is upto date and running...")
})