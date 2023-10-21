"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../supabase";
import Indicator from "../Indicator/Indicator";
import Image from "next/image";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const [indicatorMsg, setIndicatorMsg] = useState("");
  const [indicatorStatus, setIndicatorStatus] = useState(true);

  const handleTimeout = () => {
    setTimeout(() => {
      setIndicatorMsg("");
      setIndicatorStatus(true);
    }, 2500);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { user, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        // console.error("Login failed:", error.message);
        setIndicatorMsg("Email or Password is incorrect");
        setIndicatorStatus(false);
        handleTimeout();
      } else {
        // console.log("Logged in successfully");
        setEmail("");
        setPassword("");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  const handleForgottenPassword = async (e) => {
    e.preventDefault();

    // console.log("email", email);
    // let { data, error } = await supabase.auth.resetPasswordForEmail(email);

    try {
      let { data, error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        // console.error("Error resetting password:", error.message);
        setIndicatorMsg("Error resetting password.", error.message);
        setIndicatorStatus(false);
        handleTimeout();
      } else {
        // console.log("Password reset email sent successfully.");
        setIndicatorMsg("Password reset email sent successfully.");
        setIndicatorStatus(true);
        handleTimeout();
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <>
      {" "}
      <title>Signin | LCO Fee Tracker</title>
      <meta name="description" content="Signin" key="desc" />
      <link rel="icon" href="lco-logo-enhanced.svg" />
      {indicatorMsg && (
        <Indicator msg={indicatorMsg} status={indicatorStatus} />
      )}
      <div className="w-screen h-[100dvh] flex flex-col items-center justify-center font-Montserrat bg-[#357112] gap-y-10 px-5">
        <div className="flex flex-col items-center top-0 absolute mt-10 space-y-3">
          <Image
            src="lco-logo-enhanced.svg"
            alt="LCO Logo"
            width={120}
            height={120}
            priority
          />
          <div className="text-center">
            <h3 className="font-Montserrat text-white text-xs leading-tight ">
              Caraga State University
            </h3>
            <h2 className="font-Montserrat text-white text-lg font-semibold tracking-wider">
              LCO Fee Tracker
            </h2>
          </div>
          <div className="w-full md:w-[500px] px-5 border border-green-700" />
        </div>
        <div className="w-full bg-white md:w-[500px] px-5 py-10 flex flex-col items-center rounded-xl backdrop-blur-2xl shadow-2xl font-Montserrat border-b-4 border-b-[#FFCB37]">
          <h1 className="text-black text-[24px] font-bold mb-[31px]">
            Sign In
          </h1>
          <div className="w-full flex-col justify-center items-start">
            <form
              onSubmit={handleSubmit}
              method="post"
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
              {/* <input
                type="password"
                name="password"
                value={password}
                onChange={handlePasswordChange}
                required
                placeholder="Enter Your Password"
                className="w-full h-[50px] mb-[5px] text-[14px] bg-gray-200 bg-opacity-30 rounded-[10px] border border-[#357112] pl-[21.7px]"
              />
              <button className="mb-[8px]" onClick={handleForgottenPassword}>
                <h4 className="text-[12px]">Forgot Password?</h4>
              </button> */}
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
        <h3 className="flex flex-col text-white p-4 text-xs  bottom-0 absolute mb-5 text-center">
          <span className="tracking-wider font-[500]">Est. 2023-2024</span>{" "}
          <span>CSU - League of Campus Organization</span>
        </h3>
      </div>
    </>
  );
};

export default Signin;
