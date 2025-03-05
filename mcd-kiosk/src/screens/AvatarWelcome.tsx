import Avatar from "../components/Avatar";
import useMenuStore from "../store/useMenuStore";

const AvatarWelcome = () => {
  const setOrderStarted = useMenuStore((state) => state.setOrderStarted);
  const { setSessionStarted } = useMenuStore.getState();
  return (
    <div className="relative h-screen bg-gradient-to-br from-red-900 via-yellow-700 to-orange-500 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/3 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-50 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 h-full flex flex-col items-center justify-between px-8  py-12">
        {/* Left side - Text content */}
        <div className="w-full text-white space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-pica font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-red-200">
              McBuddy
            </h1>
          </div>

          <h2 className="text-4xl font-extrabold leading-tight">
            Welcome to the
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-red-300 to-orange-300">
              Future of Ordering
            </span>
          </h2>

          <p className="text-lg opacity-80 max-w-md">
            Experience seamless interaction with our
            <p className="font-bold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-amber-500 to-amber-300">
              {" AI Avatar Powered Kiosk  "}
            </p>
            Personalized recommendations, instant service, zero wait time.
          </p>

          <button
            className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-xl font-bold text-red-900 shadow-lg transition-all duration-300 hover:shadow-yellow-500/50 hover:scale-105 focus:outline-none z-100 cursor-pointer"
            onClick={() => {
              setOrderStarted(true);

              setSessionStarted(true);
            }}
          >
            <span className="relative z-100">Start Ordering</span>
            <span className="absolute inset-0 bg-gradient-to-r from-red-400 via-yellow-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>

        {/* Right side - Avatar image */}
        <div className="w-full flex justify-center items-center absolute bottom-20 left-30 md:mt-0">
          <div className="relative">
            {/* Glow effect behind avatar */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 rounded-full blur-2xl opacity-90 scale-120"></div>

            {/* Avatar placeholder (in real app, replace with actual AI avatar image) */}
            <div className="relative z-10 w-64 h-64 bg-gradient-to-br from-red-400 via-yellow-400 to-orange-400 rounded-full flex items-center justify-center overflow-hidden border-4 border-white/30">
              <Avatar />
            </div>
          </div>
        </div>
      </div>
      {/* Bottom tag line */}
      <div className="absolute bottom-6 w-full text-center text-white/70 text-sm ">
        "Where AI meets hospitality, and every order feels personal"
      </div>
    </div>
  );
};

export default AvatarWelcome;
