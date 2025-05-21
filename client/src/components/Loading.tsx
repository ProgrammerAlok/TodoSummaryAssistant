import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-purple-500 animate-spin-slower"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 bg-blue-500 rounded-full animate-ping"></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;
