import React from 'react'
import { useParams } from 'react-router-dom'
import {ZegoUIKitPrebuilt} from'@zegocloud/zego-uikit-prebuilt' 
const RoomPage = () => {
    const {roomId}=useParams();
    const myMeeting=async(element)=>{
        const appID = 1797883520; 
        const serverSecret = "998c5a5fd88e6a612fb75f2b488fe56a";

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID,serverSecret,roomId,Date.now().toString(),"Arsh")
        const zp = ZegoUIKitPrebuilt.create(kitToken);

        zp.joinRoom({
            container:element,
            scenario:{
                mdoe:ZegoUIKitPrebuilt.VideoConference,
            }
        })
    }
  return (
    <div className='room-page'>
        <div ref={myMeeting}/>
    </div>
  )
}

export default RoomPage