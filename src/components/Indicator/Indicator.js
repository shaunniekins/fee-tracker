import React from "react";

const Indicator = ({ msg, status }) => {
  const backgroundColor = status ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`top-2 md:top-5 md:right-0 absolute h-10 rounded-lg md:rounded-l-lg flex justify-center items-center px-5 py-5 text-sm md:text-md font-Montserrat ${backgroundColor}`}>
      {msg}
    </div>
  );
};
1;
export default Indicator;
