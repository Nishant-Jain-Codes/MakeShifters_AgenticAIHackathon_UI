import { useEffect } from "react";
import useMenuStore from "../store/useMenuStore";


declare global {
  interface Window {
    initAvatarInDiv: (divId: string) => void;
  }
}

export default function Avatar() {
  const isSpeaking = useMenuStore((state)=>state.isRecording);
console.log("this is isSpeaking in the avatar => ",isSpeaking)
  useEffect(() => {
    window.initAvatarInDiv("av");
  }, []);

  return (
    <div
      id="av"
      className="h-full w-[180px]  z-50 select-none pointer-events-none"
      data-speaking={isSpeaking}
    ></div>
  );
}
