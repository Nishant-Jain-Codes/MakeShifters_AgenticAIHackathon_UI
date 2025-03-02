import React, { useState, useRef } from "react";

const VoiceAssistant: React.FC = () => {
    const [transcription, setTranscription] = useState("");
    const [response, setResponse] = useState("");
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        setIsRecording(true);
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
            audioChunksRef.current = [];

            // Convert audio to Base64
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Audio = reader.result?.toString().split(",")[1]; // Remove "data:audio/wav;base64,"

                // Send base64 audio to backend
                const response = await fetch("http://localhost:8000/voice-assistant/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ audio_base64: base64Audio }),
                });

                const data = await response.json();
                if (data.transcription) {
                    setTranscription(data.transcription);
                    setResponse(data.response);
                    setAudioUrl(data.audio_url);
                }
            };
        };

        mediaRecorder.start();
    };

    const stopRecording = () => {
        setIsRecording(false);
        mediaRecorderRef.current?.stop();
    };

    const playAudio = () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    return (
        <div className="voice-assistant text-white font-bold z-50">
         
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            <p><strong>Transcription:</strong> {transcription}</p>
            <p><strong>Response:</strong> {response}</p>
            {audioUrl && (
                <button onClick={playAudio}>Play Response</button>
            )}
        </div>
    );
};

export default VoiceAssistant;
