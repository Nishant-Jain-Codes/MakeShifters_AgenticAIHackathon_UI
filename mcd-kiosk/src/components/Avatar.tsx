import { useEffect } from "react";

declare global {
  interface Window {
    initAvatarInDiv: (divId: string) => void;
  }
}

export default function Avatar() {
  useEffect(() => {
    window.initAvatarInDiv("av");
  }, []);

  return (
    <div
      id="av"
      className="h-full w-[180px]  z-50 select-none pointer-events-none"
    ></div>
  );
}
