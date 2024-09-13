const GroupVideoConference = () => {
  return ( <iframe
    allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; web-share; autoplay"
    src="https://p2p.mirotalk.com/newcall"
    style={{height: "100vh", width: "100vw" ,border: "0px"}}
></iframe> );
}
 
export default GroupVideoConference;