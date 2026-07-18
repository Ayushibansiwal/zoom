import React, { useEffect, useRef, useState } from 'react'
import { io } from "socket.io-client";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "../styles/videoComponent.css";

const server_url = "http://localhost:7000";

const connections = {};

const peerConfigConnections = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

function VideoMeet() {
    const [username, setUsername] = useState("");

    const socketRef = useRef();
    let socketIdRef = useRef();
    let localVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable,setAudioAvailable] = useState(true);

    let [video,setVideo] = useState([]);
    let [audio,setAudio] = useState();

    let [screen, setScreen] = useState();
    let [showModel,setModel] = useState();

    let [screenAvailable,setScreenAvailable] = useState();
    const [messages, setMessages] = useState([]);

    let [message,setMessage] = useState("");
    let [newMessage,setNewMessage] = useState(0);

    let [askForUsername,setAskForUsername] = useState(true);

    const videoRef = useRef([]);

    const [videos, setVideos] = useState([]);

    // todo
    // if(isChrome() === false){

    // }

    const getPermissions = async()=>{
        try {

            const videoPermission = await navigator.mediaDevices.getUserMedia({video:true});

            if(videoPermission){
                setVideoAvailable(true);
            }else{
                setVideoAvailable(false);
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({audio:true});

            if(audioPermission){
                setAudioAvailable(true);
            }else{
                setAudioAvailable(false);
            }

            if(navigator.mediaDevices.getDisplayMedia){
                setScreenAvailable(true);
            }else{
                setScreenAvailable(false);
            }

            if(videoAvailable || audioAvailable){
                const userMediaStream = await navigator.mediaDevices.getUserMedia({
                    video:videoAvailable, audio:audioAvailable
                });

                if(userMediaStream){
                    window.localStream = userMediaStream ;
                    if(localVideoRef.current){
                        localVideoRef.current.srcObject = userMediaStream;

                    }
                }
            }

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        getPermissions();
    },[]);

    let getUserMediaSuccess = (stream)=>{}

    let getUserMedia = ()=>{
        if((video && videoAvailable) || 
            (audio && audioAvailable)){
                navigator.mediaDevices.getUserMedia({
                    video:video,
                    audio:audio
                })
                .then(getUserMediaSuccess)
                .then((stream)=>{})
                .catch((e)=> console.log(e));
            }else{
                try {
                    let tracks = localVideoRef.current.srcObject.getTracks();
                    tracks.forEach(track => track.stop())
                } catch (e) {
                    
                }
            }
    }

    useEffect(()=>{
        if(video !== undefined && audio !== undefined){
            getUserMedia();
        }
    },[audio,video]);

    let gotMessageFromServer  = (fromId,message)=>{
        socketRef.current.on("connect", ()=>{
            socketRef.current.emit("join-call", window.location.href);
            socketIdRef.current = socketRef.current.id;
            socketRef.current.on("chat-message", addMessage);
            socketRef.current.on("user-left",(id)=>{
                setVideo((videos)=> 
                    videos.filter((video)=> 
                        video.socketId !== id
                ))
            })
            socketRef.current.on("user-joined",(id,clients)=>{
                clients.forEach((socketListId)=>{
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                    
                })
            })
        })
    }

    let addMessage = ()=>{}

    let connectToSocketServer = ()=>{
        socketRef.current = io.connect(server_url, {secure:false})
        socketRef.current.on("signal",gotMessageFromServer);
        socketRef.current.on("connect",()=>{
            socketRef.current.emit("join-call", window.location.href);
            socketIdRef.current = socketRef.current.id ;
            socketRef.current.on("chat-message",addMessage);
            socketRef.current.on("user-left",(id)=>{
                setVideo((videos)=> 
                    videos.filter((video)=> 
                        video.socketId !== id
                ))
            });
            socketRef.current.on("user-joined",(id,clients)=>{
                clients.forEach((socketListId)=>{
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);

                    connections[socketListId.oniceandidate] = (event)=>{
                        if(event.condidate !== null){
                            socketRef.current.emit("signal", socketListId, JSON.stringify({"ice": event.candidate}));
                        }
                    }

                    connections[socketListId].onaddstream = (event)=>{
                        let videoExits = videoRef.current.find(video => video.socketId === socketListId);
                        if(videoExits){
                            setVideo(videos=>{
                                const updateVideos = videos.map(video =>{
                                    
                                })
                            })
                        }
                    }
                });
            });
        });
    };
    
    let getMedia = ()=>{
        setVideo(videoAvailable),
        setAudio(audioAvailable),
        connectToSocketServer();
    }

  return (
    <div>
        {askForUsername === true ? 
            <div>
                <h2>Enter into Lobby</h2>
                <TextField
                    label="Username"
                    value={username}
                    id="outlined-basic" 
                    onChange={(e)=>setUsername(e.target.value)}
                />
                <Button 
                    variant="outlined"
                    onClick={connect}>Connect</Button>
                <div>
                    <video ref={localVideoRef} autoPlay muted></video>
                </div>
            </div> : <>



            </>
        }
    </div>
  )
}

export default VideoMeet