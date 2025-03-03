import React, { useState, useRef, useEffect } from "react";

const VoiceAssistant: React.FC = () => {
    const [transcription, setTranscription] = useState("");
    const [response, setResponse] = useState("");
    const [isSpeaking, setIsSpeaking] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const [maleVoice, setMaleVoice] = useState<SpeechSynthesisVoice | null>(null);
    const isRecording = useRef(false);
    const isFetchingResponse = useRef(false);

    useEffect(() => {
        const synth = window.speechSynthesis;

        const loadVoices = () => {
            if (maleVoice) return;
            const voices = synth.getVoices();
            const male = voices.find(voice => voice.name.includes("Male") || voice.name.includes("Google UK English Male"));
            setMaleVoice(male || voices[0]); // Fallback to the first available voice
        };

        if (synth.getVoices().length > 0) {
            loadVoices();
        } else {
            synth.onvoiceschanged = () => {
                loadVoices();
                synth.onvoiceschanged = null;
            };
        }

        startRecording(); // Start listening when component mounts
        return () => stopRecording(); // Cleanup on unmount
    }, []);

    const startRecording = async () => {
        if (isSpeaking || isRecording.current) return; // Prevent duplicate recordings
        isRecording.current = true;
        
        console.log("🎤 Listening...");
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunksRef.current.push(event.data);
            }
        };

        mediaRecorder.onstop = async () => {
            isRecording.current = false;

            if (isSpeaking || isFetchingResponse.current) return; // Prevent duplicate API calls
            isFetchingResponse.current = true;

            const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
            audioChunksRef.current = [];

            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
                const base64Audio = reader.result?.toString().split(",")[1];

                try {
                    console.log("📡 Sending audio...");
                    const response = await fetch("http://localhost:8000/voice-assistant/", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ audio_base64: base64Audio }),
                    });

                    const data = await response.json();
                    console.log("📩 Response received:", data);

                    // 🛑 If no transcription, restart listening immediately
                    if (data.message === "No transcription detected") {
                        console.log("❌ No transcription detected, restarting listening...");
                        isFetchingResponse.current = false;
                        startRecording();
                        return;
                    }

                    if (data.transcription) {
                        setTranscription(data.transcription);
                        setResponse(data.response);
                        console.log("✅ AI Response:", data.response);

                        if (data.response) {
                            speakResponse(data.response);
                        } else {
                            console.log("⚠️ No valid response, restarting listening...");
                            setTimeout(() => {
                                isFetchingResponse.current = false;
                                startRecording();
                            }, 5000);
                        }
                    }
                } catch (error) {
                    console.error("🚨 Error fetching response:", error);
                    setTimeout(() => {
                        isFetchingResponse.current = false;
                        startRecording();
                    }, 2000);
                }
            };
        };

        mediaRecorder.start();
        setTimeout(() => {
            if (isRecording.current) {
                mediaRecorder.stop();
            }
        }, 5000);
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
            mediaRecorderRef.current.stop();
        }
        mediaRecorderRef.current = null;
        isRecording.current = false;
    };

    const speakResponse = (text: string) => {
        stopRecording(); // Stop recording before speaking
        setIsSpeaking(true);
        console.log("🗣️ Speaking:", text);

        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);

        if (maleVoice) {
            utterance.voice = maleVoice;
        }

        utterance.pitch = 0.9;
        utterance.rate = 1.0;

        utterance.onend = () => {
            setIsSpeaking(false);
            console.log("✅ Finished speaking, restarting listening...");
            setTimeout(() => {
                isFetchingResponse.current = false;
                startRecording();
            }, 1000);
        };

        synth.speak(utterance);
    };

    return (
        <div className="voice-assistant text-white font-bold z-50">
            <p><strong>Transcription:</strong> {transcription}</p>
            <p><strong>Response:</strong> {response}</p>
        </div>
    );
};

export default VoiceAssistant;
