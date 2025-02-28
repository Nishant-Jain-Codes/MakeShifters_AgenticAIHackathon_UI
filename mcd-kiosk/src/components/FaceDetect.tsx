import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import useMenuStore from "../store/useMenuStore";


const FaceDetection  = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const detectionStopped = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { setIsLoading , setCustomerAgeClass} = useMenuStore.getState();
  const onDetect = (age : number) => {
    const customerClass = age < 18 ? "child" : age < 60 ? "adult" : "senior";
    setCustomerAgeClass(customerClass);
  };
  useEffect(() => {
    // ✅ Start loading models and set isLoading
    const loadModels = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.ageGenderNet.loadFromUri("/models"),
        ]);
        setModelsLoaded(true);
        console.log("✅ Face API models loaded successfully!");
      } catch (error) {
        console.error("❌ Error loading Face API:", error);
      }
      finally{
        setIsLoading(false);

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
          detectFace(); // ✅ Start detecting
        });

        // ✅ Start timeout for fallback age (5 sec)
        timeoutRef.current = setTimeout(() => {
          if (!detectionStopped.current) {
            console.warn("⏳ No face detected in 5 seconds, defaulting to age 18");
            onDetect(18);
            stopDetection();
          }
        }, 5000);
      } catch (error) {
        console.error("❌ Error accessing webcam:", error);
      }
      finally{
        setIsLoading(false);

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
        stopDetection();
      } else {
        requestAnimationFrame(detectFace); // Keep trying
      }
    };

    const stopDetection = () => {
      detectionStopped.current = true;
      setIsLoading(false);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (videoRef.current) {
        const stream = videoRef.current.srcObject as MediaStream;
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      }
    };

    startVideo();
  }, [modelsLoaded]);

  return <video ref={videoRef} autoPlay playsInline muted className="hidden"></video>;
};

export default FaceDetection;
