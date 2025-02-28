import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceDetection: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const detectionStopped = useRef(false); // Flag to stop detection

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.ageGenderNet.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
        console.log("✅ Face API Models Loaded Successfully");
      } catch (error) {
        console.error("❌ Error loading Face API:", error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded || !videoRef.current) return;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current!.srcObject = stream;

        videoRef.current!.addEventListener("play", () => {
          const detectFace = async () => {
            if (!videoRef.current || detectionStopped.current) return;

            const detections = await faceapi
              .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
              .withAgeAndGender();

            if (detections) {
              console.log(`🎉 Detected Age: ${Math.round(detections.age)}`);
              detectionStopped.current = true; // Stop further detections

              // Turn off the camera
              if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach((track) => track.stop()); // Stop each track
                videoRef.current.srcObject = null; // Clear video source
              }
            } else {
              requestAnimationFrame(detectFace); // Keep detecting if no face found
            }
          };

          detectFace(); // Start face detection
        });
      } catch (error) {
        console.error("❌ Error accessing webcam:", error);
      }
    };

    startVideo();
  }, [modelsLoaded]);

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline muted width="0" height="0"></video>
    </div>
  );
};

export default FaceDetection;
