import React, { useContext, useEffect, useState, useRef, useMemo } from "react";
import Plyr from "plyr-react";
import "../../styles/plyr.css";
import { ContentStateContext } from "../../context/ContentState"; // Import the ContentState context

// Components
const VideoPlayer = (props) => {
  const [contentState, setContentState] = useContext(ContentStateContext); // Access the ContentState context

  const playerRef = useRef(null);
  const [url, setUrl] = useState(null);
  const [source, setSource] = useState(null);
  const contentStateRef = useRef(contentState);
  const bannerRef = useRef(null);

  useEffect(() => {
    contentStateRef.current = contentState;
  }, [contentState]);

  useEffect(() => {
    if (
      playerRef.current &&
      playerRef.current.plyr &&
      contentState.updatePlayerTime
    ) {
      playerRef.current.plyr.currentTime = contentState.time;
    }
  }, [contentState.time]);

  const options = useMemo(
    () => ({
      controls: [
        "play",
        "rewind",
        "fast-forward",
        "progress",
        "current-time",
        "duration",
        "mute",
        "captions",
        "settings",
        "pip",
        "fullscreen",
      ],
      urls: null,
      ratio: "16:9",
      blankVideo:
        "chrome-extension://" +
        chrome.i18n.getMessage("@@extension_id") +
        "/assets/blank.mp4",
      keyboard: {
        global: true,
      },
    }),
    []
  );

  /*
  useEffect(() => {
    if (contentState.blob) {
      const objectURL = URL.createObjectURL(contentState.blob);
      setSource({
        type: "video",
        sources: [
          {
            src: objectURL,
            type: "video/mp4",
          },
        ],
      });
      setUrl(objectURL);

      return () => {
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [contentState.blob, playerRef]);
	*/

  useEffect(() => {
    if (contentState.webm || contentState.blob) {
      let vid;
      if (contentState.blob) {
        if (bannerRef.current) {
          bannerRef.current.style.display = "none";
          bannerRef.current.remove();
        }
        vid = contentState.blob;
      } else if (contentState.webm) {
        vid = contentState.webm;
      }
      const objectURL = URL.createObjectURL(vid);
      setSource({
        type: "video",
        sources: [
          {
            src: objectURL,
            type: contentState.blob ? "video/mp4" : "video/webm",
          },
        ],
      });
      setUrl(objectURL);

      return () => {
        URL.revokeObjectURL(objectURL);
      };
    }
  }, [
    contentState.webm,
    contentState.blob,
    contentState.hasBeenEdited,
    playerRef,
  ]);

  // Use a mutation observer to check if .plyr--video is added to the DOM
  useEffect(() => {
    if (contentStateRef.current.mp4ready || contentStateRef.current.blob)
      return;
    const config = { attributes: true, childList: true, subtree: true };

    const callback = function (mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (
          document.querySelector(".plyr--video") &&
          !contentStateRef.current.mp4ready &&
          !contentStateRef.current.blob &&
          !bannerRef.current &&
          !contentStateRef.current.noffmpeg &&
          !(
            contentStateRef.current.duration >
              contentStateRef.current.editLimit &&
            !contentStateRef.current.override
          )
        ) {
          bannerRef.current = document.createElement("div");
          bannerRef.current.classList.add("videoBanner");
          bannerRef.current.innerHTML = `
            <div style="
              position: absolute;
              top: 0;
              left: 0;
              width: 100vw;
              height: 100vh;
              background-color: rgba(255, 255, 255, 0.28);
              display: flex;
              justify-content: center;
              align-items: flex-start;
              color: #000;
              font-size: 18px;
              z-index: 19191919191919;
              padding-top: 80px
            ">
              Video is being processed. Please wait...
            </div>
            `;
          document.querySelector("body").appendChild(bannerRef.current);
        }
      }
    };

    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);

    return () => {
      observer.disconnect();

      if (bannerRef.current) {
        bannerRef.current.style.display = "none";
        bannerRef.current.remove();
        bannerRef.current = null;
      }
    };
  }, []);

  return (
    <div className="videoPlayer">
      <div className="playerWrap">
        {url && (
          <Plyr
            ref={playerRef}
            id="plyr-player"
            source={source}
            options={options}
          />
        )}
        {/* {contentState.mode === "player" && <Title />} */}
        {contentState.fallback && (
          <div
            role="button"
            onClick={() => contentState.downloadWEBM()}
            disabled={contentState.isFfmpegRunning}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "center",
              margin: "10px 0",
              display: "inline-block",
            }}
          >
            <div>
              <div>
                {contentState.downloadingWEBM
                  ? chrome.i18n.getMessage("downloadingLabel")
                  : chrome.i18n.getMessage("downloadWEBMButtonTitle")}
              </div>
            </div>
          </div>
        )}
        {!contentState.fallback && (
          <div
            role="button"
            onClick={() => contentState.downloadWEBM()}
            disabled={contentState.isFfmpegRunning}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              textAlign: "center",
              margin: "10px 0",
              display: "inline-block",
            }}
          >
            <div>
              <div>
                {contentState.downloadingWEBM
                  ? chrome.i18n.getMessage("downloadingLabel")
                  : chrome.i18n.getMessage("downloadWEBMButtonTitle")}
              </div>
            </div>
          </div>
        )}
      </div>
      <style>
        {`
          @media (max-width: 900px) {
            .videoPlayer {
              position: relative!important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default VideoPlayer;
