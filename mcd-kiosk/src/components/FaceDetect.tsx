import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

interface FaceDetectionProps {
  onFaceDetected: () => void;
}

const FaceDetection = ({ onFaceDetected }: FaceDetectionProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        console.log("⏳ Loading Face API models...");
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.ageGenderNet.loadFromUri("/models"),
        ]);
        console.log("✅ Face API models loaded successfully!");
        setModelsLoaded(true);
      } catch (error) {
        console.error("❌ Error loading Face API models:", error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;

    const startCamera = async () => {
      try {
        console.log("⏳ Requesting camera access...");
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            console.log("✅ Camera is ready!");
            detectFace(); // Start detection
          };
        }
      } catch (error) {
        console.error("❌ Error accessing webcam:", error);
      }
    };

    const detectFace = async () => {
      if (!videoRef.current) return;

      console.log("⏳ Starting face detection...");
      const interval = setInterval(async () => {
        if (!videoRef.current) return;

        const detections = await faceapi
          .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
          .withAgeAndGender();

        if (detections) {
          console.log(`🎉 Face detected! Age: ${Math.round(detections.age)}`);
          clearInterval(interval);
          stopCamera();
          onFaceDetected(); // ✅ Redirect after detecting face
        }
      }, 500); // Check every 500ms
    };

    const stopCamera = () => {
      console.log("⏹ Stopping camera...");
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };

    startCamera();

    return () => stopCamera();
  }, [modelsLoaded]);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline muted className="hidden"></video>
    </>
  );
};

export default FaceDetection;
