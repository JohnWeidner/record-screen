import React, { useContext } from "react";
import { contentStateContext } from "../context/ContentState";

const PopupRecording = () => {
  const [contentState] = useContext(contentStateContext);

  const handlePause = () => {
    contentState.pauseRecording && contentState.pauseRecording();
  };

  const handleResume = () => {
    contentState.resumeRecording && contentState.resumeRecording();
  };

  const handleStop = () => {
    contentState.stopRecording && contentState.stopRecording();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 2147483647,
      pointerEvents: 'none'
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '12px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        alignItems: 'center',
        pointerEvents: 'auto',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(0,0,0,0.1)',
        minWidth: '200px'
      }}>
        <h4 style={{
          margin: '0',
          fontSize: '14px',
          color: '#1a1a1a',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: contentState.paused ? '#ffa500' : '#ff4444',
            animation: contentState.paused ? 'none' : 'pulse 1.5s infinite'
          }}/>
          {contentState.paused ? "Recording Paused" : "Recording..."}
        </h4>

        <div style={{
          display: 'flex',
          gap: '8px'
        }}>
          {contentState.paused ? (
            <button style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#4CAF50',
              color: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease',
              ':hover': {
                backgroundColor: '#45a049'
              }
            }} onClick={handleResume}>
              ▶️ Resume
            </button>
          ) : (
            <button style={{
              padding: '6px 12px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#2196F3',
              color: 'white',
              cursor: 'pointer',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease',
            }} onClick={handlePause}>
              ⏸ Pause
            </button>
          )}

          <button style={{
            padding: '6px 12px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#f44336',
            color: 'white',
            cursor: 'pointer',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s ease',
          }} onClick={handleStop}>
            🟥 Stop
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
          button:hover {
            transform: translateY(-1px);
            filter: brightness(1.1);
          }
          button:active {
            transform: translateY(0px);
          }
        `}
      </style>
    </div>
  );
};

export default PopupRecording;
