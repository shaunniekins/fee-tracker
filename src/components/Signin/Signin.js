import React, { useState } from "react";

const Signin = ({ isUser, setIsUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    setEmail("");
    setPassword("");

    // Add any additional logic you want to perform on form submission
  };

  return (
    <div className="w-full bg-white md:w-[500px] px-5 py-10 flex flex-col items-center rounded-2xl backdrop-blur-2xl shadow-2xl">
      <h1 className="text-black text-[24px] font-bold mb-[31px]">Sign In</h1>
      <div className="w-full flex-col justify-center items-start">
        <form
          onSubmit={handleSubmit}
          className="flex-col justify-start items-start flex">
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder="Enter Your Email"
            className="w-full h-[50px] mb-[18px] text-[14px] bg-gray-200 bg-opacity-30 rounded-[10px] border border-[#357112] pl-[21.7px]"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            required
            placeholder="Enter Your Password"
            className="w-full h-[50px] mb-[8px] text-[14px] bg-gray-200 bg-opacity-30 rounded-[10px] border border-[#357112] pl-[21.7px]"
          />
          <button className="w-full h-[50px] mb-[10px] mt-[20px] text-[18px] text-white font-semibold bg-[#357112] rounded-[10px]">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signin;
