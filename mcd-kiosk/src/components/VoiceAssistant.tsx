import React, { useState, useRef, useEffect } from "react";

const VoiceAssistant: React.FC = () => {
    const [transcription, setTranscription] = useState("");
    const [response, setResponse] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [maleVoice, setMaleVoice] = useState<SpeechSynthesisVoice | null>(null);

    useEffect(() => {
        const synth = window.speechSynthesis;

        const loadVoices = () => {
            const voices = synth.getVoices();
            const male = voices.find(voice => voice.name.includes("Male") || voice.name.includes("Google UK English Male"));
            setMaleVoice(male || voices[0]); // Fallback to the first available voice
        };

        if (synth.getVoices().length > 0) {
            loadVoices();
        } else {
            synth.onvoiceschanged = loadVoices; // Ensure voices load when they become available
        }
    }, []);

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
                const base64Audio = reader.result?.toString().split(",")[1];

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
                    speakResponse(data.response);
                }
            };
        };

        mediaRecorder.start();
    };

    const stopRecording = () => {
        setIsRecording(false);
        mediaRecorderRef.current?.stop();
    };

    const speakResponse = (text: string) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        if (maleVoice) {
            utterance.voice = maleVoice;
        }

        utterance.pitch = 0.9; // Slightly lower pitch for a more natural male tone
        utterance.rate = 1.0;  // Normal speaking speed

        synth.speak(utterance);
    };

    return (
        <div className="voice-assistant text-white font-bold z-50">
            <button onClick={isRecording ? stopRecording : startRecording}>
                {isRecording ? "Stop Recording" : "Start Recording"}
            </button>
            <p><strong>Transcription:</strong> {transcription}</p>
            <p><strong>Response:</strong> {response}</p>
            {response && (
                <button onClick={() => speakResponse(response)}>Play Response</button>
            )}
        </div>
    );
};

export default VoiceAssistant;