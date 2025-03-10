import React, { useState, useRef, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useMenuStore from "../store/useMenuStore";

interface ChatMessage {
  id: number;
  type: "user" | "assistant";
  text: string;
  timestamp: Date;
}

const VoiceAssistant: React.FC = () => {
  const { transcript } = useSpeechRecognition();
  const [transcription, setTranscription] = useState("");
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [maleVoice, setMaleVoice] = useState<SpeechSynthesisVoice | null>(null);
  const isRecording = useRef(false);
  const isFetchingResponse = useRef(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastAudioLevelRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const synth = window.speechSynthesis;

    const loadVoices = () => {
      if (maleVoice) return;
      const voices = synth.getVoices();
      const male = voices.find(
        (voice) =>
          voice.name.includes("Male") ||
          voice.name.includes("Google UK English Male")
      );
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
    return () => {
      stopRecording(); // Cleanup on unmount
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const detectSilence = (stream: MediaStream, silenceDelay: number) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const audioContext = audioContextRef.current;
    const analyser = audioContext.createAnalyser();
    analyserRef.current = analyser;
    
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256;
    
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const checkAudioLevel = () => {
      if (!isRecording.current || isSpeaking) return;
      
      analyser.getByteFrequencyData(dataArray);
      const audioLevel = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
      
      // Check if audio level is above threshold
      if (audioLevel > 10) {
        lastAudioLevelRef.current = Date.now();
        
        // Reset silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      } else {
        // Start silence timer if not already running
        if (!silenceTimerRef.current && lastAudioLevelRef.current > 0) {
          const timeSinceLastAudio = Date.now() - lastAudioLevelRef.current;
          
          // Only set timer if at least some audio was detected
          if (timeSinceLastAudio >= 500) {
            silenceTimerRef.current = setTimeout(() => {
              console.log("🔇 Silence detected for 1 seconds");
              // If we're still recording, stop and process
              if (isRecording.current && mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
              }
              silenceTimerRef.current = null;
            }, silenceDelay);
          }
        }
      }
      
      requestAnimationFrame(checkAudioLevel);
    };
    
    checkAudioLevel();
  };

  const startRecording = async () => {
    if (isSpeaking || isRecording.current) return; // Prevent duplicate recordings
    isRecording.current = true;
    
    console.log("🎤 Listening...");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      // Reset last audio level
      lastAudioLevelRef.current = 0;
      
      // Set up silence detection (3 seconds)
      detectSilence(stream, 2000);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        isRecording.current = false;

        // Clean up silence detection
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }

        if (isSpeaking || isFetchingResponse.current) return; // Prevent duplicate API calls
        
        // Check if we have any meaningful audio data
        if (audioChunksRef.current.length === 0) {
          console.log("❌ No audio data collected, restarting listening...");
          setTimeout(() => startRecording(), 500);
          return;
        }
        
        isFetchingResponse.current = true;
        setShowLoading(true);

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
            setShowLoading(false);

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

              // Add user message to chat history
              setChatHistory(prev => [
                ...prev,
                {
                  id: Date.now(),
                  type: "user",
                  text: data.transcription,
                  timestamp: new Date()
                }
              ]);

              if (data.response) {
                // Add assistant response to chat history
                setChatHistory(prev => [
                  ...prev,
                  {
                    id: Date.now() + 1,
                    type: "assistant",
                    text: data.response,
                    timestamp: new Date()
                  }
                ]);
                speakResponse(data.response);
              } else {
                console.log("⚠️ No valid response, restarting listening...");
                setTimeout(() => {
                  isFetchingResponse.current = false;
                  startRecording();
                }, 1000);
              }
            }
          } catch (error) {
            console.error("🚨 Error fetching response:", error);
            setShowLoading(false);
            setTimeout(() => {
              isFetchingResponse.current = false;
              startRecording();
            }, 2000);
          }
        };
      };

      mediaRecorder.start();
      
      // Set a maximum recording time (30 seconds) as a fallback
      setTimeout(() => {
        if (isRecording.current && mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          console.log("⏱️ Maximum recording time reached");
          mediaRecorderRef.current.stop();
        }
      }, 30000);
      
    } catch (error) {
      console.error("🚨 Error starting recording:", error);
      isRecording.current = false;
      setTimeout(() => startRecording(), 2000);
    }
  };

  const stopRecording = () => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.suspend();
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

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="voice-assistant flex flex-col text-xs h-full w-[370px] bg-gradient-to-b from-red-700 to-red-800 text-white p-4 rounded-lg shadow-2xl z-60">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb- border-b border-yellow-500">
        <h2 className="font-bold text-yellow-400 font-pica text-lg">McBuddy</h2>
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${isRecording.current ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`}></div>
          <span className="text-sm font-medium text-yellow-300">
            {isRecording.current ? 'Listening...' : isSpeaking ? 'Speaking...' : showLoading ? 'Processing...' : 'Ready'}
          </span>
        </div>
      </div>
      
      {/* Chat History */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 pb-2"
      >
        {chatHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6 bg-red-800 bg-opacity-40 rounded-lg">
              <div className="w-6 h-6 mx-auto mb-4">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-400">
                  <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M4.34 9.65002V11.35C4.34 15.57 7.78 19 12 19C16.22 19 19.66 15.57 19.66 11.35V9.65002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.34 6.65002C12.15 6.15002 14.06 6.54002 15.64 7.68002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10.73 9.68998C12.25 9.36998 13.87 9.62 15.22 10.39" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11.11 12.7C12.12 12.52 13.16 12.63 14.11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p className="text-yellow-300 font-medium">Say something to start ordering</p>
            </div>
          </div>
        ) : (
          chatHistory.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-3/4 p-3 px-4 shadow-md ${
                  message.type === "user" 
                    ? "bg-yellow-500 text-red-900 rounded-2xl rounded-tr-none" 
                    : "bg-red-600 border border-yellow-500 rounded-2xl rounded-tl-none"
                }`}
              >
                <p className="font-medium break-words">{message.text}</p>
                <p className={`text-xs mt-1 ${message.type === "user" ? "text-red-800" : "text-yellow-300"}`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Bottom Control Area */}
      <div className="absolute bottom-0 right-0 p-1 w-[180px]">
        <div className="flex items-center justify-between bg-red-800 p-2 rounded-full border-1 border-yellow-500">
          <div className="flex-1 px-2">
            {showLoading ? (
              <div className="flex items-center space-x-2">
                <div className="text-yellow-400 font-medium">Processing...</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                </div>
              </div>
            ) : (
              <div className="text-yellow-300">
                {transcript ? `"${transcript}"` : "Listening..."}
              </div>
            )}
          </div>
          <div className="relative">
            <div className={`w-5 h-5 flex items-center justify-center rounded-full ${isRecording.current ? 'bg-green-500' : 'bg-yellow-500'}`}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-red-900">
                <path d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4.34 9.65002V11.35C4.34 15.57 7.78 19 12 19C16.22 19 19.66 15.57 19.66 11.35V9.65002" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 19V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {isRecording.current && (
              <div className="absolute top-0 left-0 w-5 h-5 rounded-full bg-green-500 animate-ping opacity-50"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceAssistant;