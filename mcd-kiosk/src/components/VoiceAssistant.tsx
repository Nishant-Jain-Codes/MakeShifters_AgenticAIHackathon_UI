import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { moveToPreviousScreen } from "../utils/functions";
import useMenuStore from "../store/useMenuStore";
import { ChevronLeft } from "lucide-react";

const VoiceAssistant: React.FC = () => {
  const [transcription, setTranscription] = useState("");
  const [response, setResponse] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { id: string; type: string; text: string; timestamp: Date }[]
  >([]);
  const { setCurrentUserTranscription, setCurrentLLMResponse } =
    useMenuStore.getState();
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [maleVoice, setMaleVoice] = useState<SpeechSynthesisVoice | null>(null);
  const isRecording = useRef(false);
  const { setIsRecording } = useMenuStore.getState();
  const isFetchingResponse = useRef(false);
  const canRestart = useRef(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const sessionStarted = useMenuStore((state) => state.sessionStarted);
  const [modelState,  setModelState] = useState<number>(0); //0 -> listening // 1-> processing // 2-> speaking
  // useEffect(()=>{
  //   if(sessionStarted){
  //     manualStartRecording();
  //   }
  // },[sessionStarted])
  useEffect(()=>{
    console.error("modelState",modelState);
  },[modelState])
  const moveToNextModelState = () => {
    // setModelState((prev) => (prev + 1) % 3);
  }

  useEffect(() => {
    const synth = window.speechSynthesis;
    // setModelState(1);
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
    // setModelState(2)
    return () => stopRecording(); // Cleanup on unmount
  }, []);

  // Scroll to bottom of chat history when new messages are added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const startRecording = async () => {
    // setModelState(0);
    // Only start recording if canRestart is true and not already recording or speaking
    if (!canRestart.current || isSpeaking || isRecording.current) return;

    isRecording.current = true;
    setIsRecording(true);
    // setModelState(0)
    canRestart.current = false;

    console.log("🎤 Listening...");
    try {
      setModelState(0)
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
        setIsRecording(false);
        if (isSpeaking || isFetchingResponse.current) return;
        isFetchingResponse.current = true;
        setShowLoading(true);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        audioChunksRef.current = [];

        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(",")[1];

          try {
            // setModelState(1)
            console.log("📡 Sending audio...");
            setModelState(1)
            const response = await fetch(
              "http://localhost:8000/voice-assistant/",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ audio_base64: base64Audio }),
              }
            );

            if (response.status !== 200) {
              toast.error("Server busy handling too many orders ");
              setShowLoading(false);
              setTimeout(() => {
                isFetchingResponse.current = false;
                canRestart.current = true;
              }, 2000);
              return;
            }
            setModelState(2)
            const data = await response.json();
            if (data?.transcription) {
              setCurrentUserTranscription(data?.transcription);
            }
            if (data?.items) {
              setCurrentLLMResponse(data?.items);
            }
            console.log("📩 Response received:", data);
            setShowLoading(false);
            // setModelState(1)

            // 🛑 If no transcription, restart listening immediately
            if (data.message === "No transcription detected") {
              console.log(
                "❌ No transcription detected, restarting listening..."
              );
              isFetchingResponse.current = false;
              canRestart.current = true;
              startRecording();
              return;
            }

            if (data.transcription) {
              setTranscription(data.transcription);
              setTranscript(data.transcription);
              setResponse(data.response);
              console.log("✅ AI Response:", data.response);

              // Add messages to chat history
              setChatHistory((prev) => [
                ...prev,
                {
                  id: `user-${Date.now()}`,
                  type: "user",
                  text: data.transcription,
                  timestamp: new Date(),
                },
                {
                  id: `assistant-${Date.now() + 1}`,
                  type: "assistant",
                  text: data.response,
                  timestamp: new Date(),
                },
              ]);

              if (data.response) {
                speakResponse(data.response.substring(0, 250));
              } else {
                console.log("No valid response, restarting listening...");
                toast.error("Server busy handling too many orders ");
                // setModelState(1)
                setTimeout(() => {
                  isFetchingResponse.current = false;
                  canRestart.current = true;
                  startRecording();
                  // setModelState(2)
                }, 5000);
              }
            }
          } catch (error) {
            console.error("🚨 Error fetching response:", error);
            toast.error("Server busy handling too many orders ");
            setShowLoading(false);
            setTimeout(() => {
              isFetchingResponse.current = false;
              canRestart.current = true;
              startRecording();
              // setModelState(0)
            }, 2000);
            // setModelState(1)
          }
        };
      };

      mediaRecorder.start();
      setTimeout(() => {
        if (isRecording.current) {
          mediaRecorder.stop();
        }
      }, 5000);
    } catch (error) {
      console.error("Error starting recording:", error);
      isRecording.current = false;
      setIsRecording(false);
      canRestart.current = true;
    }
  };

  const speakResponse = (text: string) => {
    stopRecording(); // Stop recording before speaking
    setIsSpeaking(true);
    // setModelState(2)
    console.log("🗣️ Speaking:", text);

    const synth = window.speechSynthesis;

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    if (maleVoice) {
      utterance.voice = maleVoice;
    }

    utterance.pitch = 0.9;
    utterance.rate = 1.0;

    utterance.onstart = () => {
      console.log("Speech started");
    };

    utterance.onend = () => {
      console.log("✅ Speech completely finished");

      // Use a more robust method to ensure speech has stopped
      const checkSpeechEnd = () => {
        if (synth.speaking) {
          // If still speaking, wait a bit more
          setTimeout(checkSpeechEnd, 100);
        } else {
          // Speech truly finished
          setIsSpeaking(false);
          isFetchingResponse.current = false;
          canRestart.current = true;
          console.log("🎤 Ready to listen...");

          // Ensure we start recording after a short delay
          // setModelState(0)
          setTimeout(manualStartRecording, 500);
        }
      };

      checkSpeechEnd();
    };

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);

      // Fallback error handling
      setIsSpeaking(false);
      // setModelState(0)
      isFetchingResponse.current = false;
      canRestart.current = true;
      setTimeout(manualStartRecording, 500);
    };

    // Speak the utterance
    synth.speak(utterance);
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    isRecording.current = false;
    setIsRecording(false);
  };

  const manualStartRecording = () => {
    canRestart.current = true;
    startRecording();
  };

  const currentScreen = useMenuStore((state) => state.currentScreen);

  return (
    <div className="voice-assistant flex flex-col text-[0.6rem] h-full w-[370px] bg-gradient-to-b from-red-700 to-red-800 text-white p-4 rounded-lg shadow-2xl z-60">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb- border-b border-yellow-500">
        <div className="flex items-center space-x-2">
          {currentScreen !== "OrderTypeSelection" && (
            <button
              onClick={moveToPreviousScreen}
              className=" bg-yellow-500 rounded-full p-1 z-100 relative bottom-1  border-yellow-600 hover:bg-yellow-400"
            >
              <ChevronLeft size={16} className="text-red-800" />
            </button>
          )}
          <h2
            className="font-bold text-yellow-400 font-pica text-lg"
            onClick={manualStartRecording}
          >
            McBuddy
          </h2>
        </div>

        <div className="flex items-center space-x-2">
          <div
            className={`h-3 w-3 rounded-full ${
              isRecording.current
                ? "bg-green-400 animate-pulse"
                : "bg-yellow-400"
            }`}
          ></div>
          <span className="text-sm font-medium text-yellow-300">
            {isRecording.current
              ? "Listening..."
              : isSpeaking
              ? "Speaking..."
              : showLoading
              ? "Processing..."
              : "Ready"}
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
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-yellow-400"
                >
                  <path
                    d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4.34 9.65002V11.35C4.34 15.57 7.78 19 12 19C16.22 19 19.66 15.57 19.66 11.35V9.65002"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.34 6.65002C12.15 6.15002 14.06 6.54002 15.64 7.68002"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.73 9.68998C12.25 9.36998 13.87 9.62 15.22 10.39"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11.11 12.7C12.12 12.52 13.16 12.63 14.11 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 19V22"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="text-yellow-300 font-medium">
                Say something to start ordering
              </p>
            </div>
          </div>
        ) : (
          chatHistory.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-3/4 p-1 px-4 shadow-md ${
                  message.type === "user"
                    ? "bg-yellow-500 text-red-900 rounded-2xl rounded-tr-none"
                    : "bg-red-600 border border-yellow-500 rounded-2xl rounded-tl-none"
                }`}
              >
                <p className="font-medium break-words">{message.text}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Control Area */}
      <div className="absolute bottom-0 right-0 p-1 w-[180px]">
        <div className="flex items-center justify-between bg-red-800 p-2 rounded-full border-1 border-yellow-500">
          <div className="flex-1 px-2">
            <div className="flex items-center space-x-2">
              {modelState === 0 && (
                <div className="text-yellow-400 font-medium">Listening...</div>
              )}
              {modelState === 1 && (
                <div className="flex items-center space-x-2">
                  <div className="text-yellow-400 font-medium">
                    Processing...
                  </div>
                  <div className="flex space-x-1">
                    <div
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              )}
              {modelState === 2 && (
                <div className="text-yellow-400 font-medium">Speaking...</div>
              )}
            </div>
          </div>
          <div className="relative">
            <div
              className={`w-5 h-5 flex items-center justify-center rounded-full ${
                isRecording.current ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 text-red-900"
              >
                <path
                  d="M12 15.5C14.21 15.5 16 13.71 16 11.5V6C16 3.79 14.21 2 12 2C9.79 2 8 3.79 8 6V11.5C8 13.71 9.79 15.5 12 15.5Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4.34 9.65002V11.35C4.34 15.57 7.78 19 12 19C16.22 19 19.66 15.57 19.66 11.35V9.65002"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 19V22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
