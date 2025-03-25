import React, { useEffect, useState, useRef, useCallback } from "react";

const Recorder = () => {
  useEffect(() => {
    window.parent.postMessage(
      {
        type: "screenity-permissions-loaded",
      },
      "*"
    );
  }, []);

  const checkPermissions = async () => {
    try {
      const microphonePermission = await navigator.permissions.query({
        name: "microphone",
      });

      microphonePermission.onchange = () => {
        checkPermissions();
      };

      if (microphonePermission.state === "granted") {
        enumerateDevices(false, true); // chỉ yêu cầu mic
      } else {
        window.parent.postMessage(
          {
            type: "screenity-permissions",
            success: false,
            error: "microphone-permission-denied",
          },
          "*"
        );
      }
    } catch (err) {
      window.parent.postMessage(
        {
          type: "screenity-permissions",
          success: false,
          error: err.name,
        },
        "*"
      );
    }
  };

  // Enumerate devices
  const enumerateDevices = async (_camGranted = false, micGranted = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: micGranted,
        video: false, // camera bị tắt hoàn toàn
      });
  
      const devicesInfo = await navigator.mediaDevices.enumerateDevices();
  
      const audioinput = micGranted
        ? devicesInfo
            .filter((d) => d.kind === "audioinput")
            .map((d) => ({ deviceId: d.deviceId, label: d.label }))
        : [];
  
      const audiooutput = micGranted
        ? devicesInfo
            .filter((d) => d.kind === "audiooutput")
            .map((d) => ({ deviceId: d.deviceId, label: d.label }))
        : [];
  
      // Không lấy camera
      const videoinput = [];
  
      chrome.storage.local.set({
        audioinput,
        audiooutput,
        videoinput,
        cameraPermission: false, // gửi false rõ ràng
        microphonePermission: micGranted,
      });
  
      window.parent.postMessage(
        {
          type: "screenity-permissions",
          success: true,
          audioinput,
          audiooutput,
          videoinput,
          cameraPermission: false,
          microphonePermission: micGranted,
        },
        "*"
      );
  
      stream.getTracks().forEach((track) => track.stop());
    } catch (err) {
      window.parent.postMessage(
        {
          type: "screenity-permissions",
          success: false,
          error: err.name,
        },
        "*"
      );
    }
  };
  

  const onMessage = (message) => {
    if (message.type === "screenity-get-permissions") {
      checkPermissions();
    }
  };

  // Post message listener
  useEffect(() => {
    window.addEventListener("message", (event) => {
      onMessage(event.data);
    });
  }, []);

  return <div></div>;
};

export default Recorder;
