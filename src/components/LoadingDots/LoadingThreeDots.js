"use client";

import { ThreeDots } from "react-loader-spinner";

const LoadingThreeDots = () => {
  return (
    <div className="flex w-screen h-[100dvh] justify-center items-center">
      <ThreeDots
        height="80"
        width="80"
        radius="9"
        color="#4fa94d"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={true}
      />
    </div>
  );
};

export default LoadingThreeDots;
