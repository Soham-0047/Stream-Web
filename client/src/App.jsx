import { useState,useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import './App.css'

function App() {
  
  const [overlays, setOverlays] = useState([]);
  const [newOverlay, setNewOverlay] = useState({});
  const [rtspUrl, setRtspUrl] = useState('');
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const playerRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/overlays')
      .then((response) => response.json())
      .then((data) => setOverlays(data))
      .catch((error) => console.error(error));

    // Fetch the RTSP URL from your backend or set it directly
    setRtspUrl('https://youtu.be/6V5DJB4YiRg');
  }, []);

  const handleOverlayCreate = () => {
    fetch('http://localhost:8000/api/overlays', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newOverlay),
    })
      .then((response) => response.json())
      .then((data) => {
        setOverlays([...overlays, data]);
        setNewOverlay({});
      })
      .catch((error) => console.error(error));
  };


  const handleVideoPlay = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0); // Start from the beginning
      setIsVideoPlaying(true);
    }
  };

  const handleVideoPause = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0); // Pause by seeking to the beginning
      setIsVideoPlaying(false);
    }
  };

  const handleOverlayUpdate = (overlayId, updatedOverlayData) => {

   

    // Update the video overlay's properties
    setNewOverlay({ ...newOverlay, ...updatedOverlayData });


    fetch(`http://localhost:8000/api/overlays/${overlayId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedOverlayData),
    })
      .then((response) => response.json())
      .then((updatedOverlay) => {
        setOverlays((prevOverlays) =>
          prevOverlays.map((overlay) =>
            overlay._id === overlayId ? updatedOverlay : overlay
          )
        );
      })
      .catch((error) => console.error(error));
  };

  const handleOverlayDelete = (overlayId) => {
    fetch(`http://localhost:8000/api/overlays/${overlayId}`, {
      method: 'DELETE',
    })
      .then(() => {
        setOverlays(overlays.filter((overlay) => overlay._id !== overlayId));
      })
      .catch((error) => console.error(error));
  };



  console.log(`${newOverlay.width}`)
  console.log(`${newOverlay.height}`)
  console.log(`${newOverlay}`)

  return (
    <>
        <div className="App">
        <h1>Video Streaming App</h1>
         <h2>Live Stream</h2>

<div className="overlay-full-wrap">

  <div className='overlay-left'
  >   
  
        <div className="player-wrapper">
           <ReactPlayer
           className="react-player"
          ref={playerRef}
          url={rtspUrl}
          playing={isVideoPlaying}
          controls={true}
          width={`${newOverlay.width}%`}
          height={`${newOverlay.height}%`}
          style={{
            left: `${newOverlay.positionX}px`,
            top: `${newOverlay.positionY}px`,
          }}
        />
        </div>
       
        <div className="btn-wrap"
        style={{    
          left:`${newOverlay.positionX}px`,
          top:`${newOverlay.positionY}px`,}}>
          <button className="btn" onClick={handleVideoPlay}>Play</button>
          <button className="btn" onClick={handleVideoPause}>Pause</button>
        </div>


      </div>


      <div className='overlay-right'>
        <h2>Add Overlay</h2>
        {/* Input fields for content, positionX, positionY, width, and height */}

        <div className="overlay-con">


          <div className="ov-content">
             <label for="Content">Your Content: </label>
         <input
          type="text"
          placeholder="Content"
          value={newOverlay.content || ''}
          onChange={(e) =>
            setNewOverlay({ ...newOverlay, content: e.target.value })
          }
        />
          </div>


          <div className="ov-posx">
            <label>PositionX: </label>
             <input
          type="number"
          placeholder="Position X"
          value={newOverlay.positionX || ''}
          onChange={(e) =>
            setNewOverlay({ ...newOverlay, positionX: +e.target.value })
          }
        />
          </div>
         
         <div className="ov-posy">
          <label>PositionY: </label>
          <input
          type="number"
          placeholder="Position Y"
          value={newOverlay.positionY || ''}
          onChange={(e) =>
            setNewOverlay({ ...newOverlay, positionY: +e.target.value })
          }
        />
         </div>


         <div className="ov-width">
          <label>Width: </label>
           <input
          type="number"
          placeholder="Width"
          value={newOverlay.width || ''}
          onChange={(e) =>
            setNewOverlay({ ...newOverlay, width: +e.target.value })
          }
        />
         </div>


         <div className="ov-height">
          <label>Height: </label>
           <input
          type="number"
          placeholder="Height"
          value={newOverlay.height || ''}
          onChange={(e) =>
            setNewOverlay({ ...newOverlay, height: +e.target.value })
          }
        />
         </div>
          
     

        </div>
        
       
       
       
        
        <button className="btn"style={{margin:"10px"}} onClick={handleOverlayCreate}>Create Overlay</button>
      </div>
</div>

    




      <div>
        <h2>Previous Overlays</h2>
        <ul style={{
          listStyle:"none"
        }}>
          {overlays.map((overlay) => (
            <li key={overlay._id}>
              {overlay.content} | X: {overlay.positionX}, Y: {overlay.positionY}, W: {overlay.width}, H: {overlay.height}

              <button
              className='btn1'
                onClick={() =>
                  handleOverlayUpdate(overlay._id, {
                    // Pass updated overlay data here
                    content: overlay.content,
                    positionX: overlay.positionX, // Example: Change position
                    positionY: overlay.positionY,
                    width: overlay.width, // Example: Change width
                    height: overlay.height, // Example: Change height
                  })
                }
              >
                Update
              </button>
              <button className="btn1" onClick={() => handleOverlayDelete(overlay._id)}>Delete</button>

            </li>
          ))}
        </ul>
      </div>
    </div>
    </>
  )
}

export default App
