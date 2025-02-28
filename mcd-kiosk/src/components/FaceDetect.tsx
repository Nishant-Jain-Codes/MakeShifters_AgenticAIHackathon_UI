import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

interface FaceDetectionProps {
  onDetect: (age: number) => void;
}

const FaceDetection: React.FC<FaceDetectionProps> = ({ onDetect }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const detectionStopped = useRef(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.ageGenderNet.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
        console.log("Face API models loaded successfully!");
      } catch (error) {
        console.error("Error loading Face API:", error);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }

        videoRef.current?.addEventListener("loadedmetadata", () => {
          detectFace(); // Start detecting
        });
      } catch (error) {
        console.error("Error accessing webcam:", error);
      }
    };

    const detectFace = async () => {
      if (!videoRef.current || detectionStopped.current) return;

      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withAgeAndGender();

      if (detections) {
        const age = Math.round(detections.age);
        console.log(`🎉 Detected Age: ${age}`);
        onDetect(age);
        detectionStopped.current = true;

        // Stop camera after detection
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      } else {
        requestAnimationFrame(detectFace); 
      }
    };

    startVideo();
  }, [modelsLoaded]);

  return <video ref={videoRef} autoPlay playsInline muted className="hidden"></video>;
};

export default FaceDetection;
