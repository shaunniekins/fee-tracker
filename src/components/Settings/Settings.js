"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../supabase";
import Navbar from "../Navbar/Navbar";
import Indicator from "../Indicator/Indicator";
import { useRouter } from "next/navigation";

import {
  fetchSettingsData,
  updateSettingsData,
} from "@/app/data/settings_data";

const Settings = () => {
  const [currentUser, setCurrentUser] = useState("");
  const [email, setEmail] = useState("");
  const [isEditEmail, setIsEditEmail] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [indicatorMsg, setIndicatorMsg] = useState("");
  const [indicatorStatus, setIndicatorStatus] = useState(true);

  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");

  const [schoolYear, setSchoolYear] = useState("");
  const [idKey, setIdKey] = useState("");

  const router = useRouter();

  const [initialEmail, setInitialEmail] = useState("");
  const [initialSchoolYear, setInitialSchoolYear] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: settingsData } = await fetchSettingsData();
        const settings = settingsData;

        setSchoolYear(settings[0].school_year);
        setInitialSchoolYear(settings[0].school_year);
        setIdKey(settings[0].id);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmNewPasswordChange = (e) => {
    setConfirmNewPassword(e.target.value);
  };

  const handleCreateEmailChange = (e) => {
    setCreateEmail(e.target.value);
  };

  const handleCreatePasswordChange = (e) => {
    setCreatePassword(e.target.value);
  };

  const handleSchoolYearChange = (e) => {
    setSchoolYear(e.target.value);
  };

  const handleTimeout = () => {
    setTimeout(() => {
      setIndicatorMsg(""); // Clear the message
      setIndicatorStatus(true); // Hide the indicator
    }, 2500); // 3000 milliseconds (3 seconds)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);
        setInitialEmail(user.email);

        // console.log("user", user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchData();
  }, []);

  const handleNewEmailSubmission = async (e) => {
    e.preventDefault();

    try {
      const { error } = await supabase.auth.updateUser({
        email: email,
      });

      if (error) {
        console.error("Error updating email:", error.message);
        setIndicatorMsg("An error occurred while changing the email.");
        setIndicatorStatus(false);
        handleTimeout();
      } else {
        setIndicatorMsg("Check email for confirmation of change.");
        setIndicatorStatus(true);
        handleTimeout();

        setCreateEmail("");
        setCreatePassword("");

        await supabase.auth.signOut();
        router.push("/signin");
      }
    } catch (error) {
      console.error("Error updating email:", error.message);
      setIndicatorMsg("An error occurred while changing the email.");
      setIndicatorStatus(false);
      handleTimeout();
    }
  };

  const handleNewPasswordSubmission = async (e) => {
    e.preventDefault();

    if (newPassword === confirmNewPassword) {
      try {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (error) {
          console.error("Error updating password:", error.message);
          setIndicatorMsg("An error occurred while changing the password.");
          setIndicatorStatus(false);
          handleTimeout();
        } else {
          setIndicatorMsg("Successfully changed password.");
          setIndicatorStatus(true);
          handleTimeout();

          // Reset the input fields to blank
          setNewPassword("");
          setConfirmNewPassword("");

          await supabase.auth.signOut();
          router.push("/signin");
        }
      } catch (error) {
        console.error("Error updating password:", error.message);
        setIndicatorMsg("An error occurred while changing the password.");
        setIndicatorStatus(false);
        handleTimeout();
      }
    } else {
      setIndicatorMsg("Passwords do not match.");
      setIndicatorStatus(false);
      handleTimeout();
    }
  };

  const handleNewAccount = async (e) => {
    e.preventDefault();

    try {
      let { data, error } = await supabase.auth.signUp({
        email: createEmail,
        password: createPassword,
      });

      if (error) {
        console.error("Error creating account:", error.message);
        setIndicatorMsg("An error occurred while creating the account.");
        setIndicatorStatus(false);
        handleTimeout();
      } else {
        setIndicatorMsg("Account created successfully.");
        setIndicatorStatus(true);
        handleTimeout();
        router.push("/signin");
      }
    } catch (error) {
      console.error("Error creating account:", error.message);
      setIndicatorMsg("An error occurred while creating the account.");
      setIndicatorStatus(false);
      handleTimeout();
    }
  };

  const handleUpdateSchoolYear = async (e) => {
    e.preventDefault();

    const updateData = {
      school_year: schoolYear,
    };

    await updateSettingsData(idKey, updateData);

    setInitialSchoolYear(schoolYear);
    setSchoolYear(schoolYear);

    setIndicatorMsg("School year updated successfully.");
    setIndicatorStatus(true);
    handleTimeout();
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-x-hidden select-none">
      <Navbar />
      {indicatorMsg && (
        <Indicator msg={indicatorMsg} status={indicatorStatus} />
      )}
      <div className="flex flex-col py-12 md:py-20 px-5 sm:px-10 lg:px-52 2xl:px-[500px] font-Montserrat gap-y-6">
        <div>
          <h1 className="font-semibold">Profile Information </h1>
          <div className="w-full px-5 border border-green-700" />
        </div>
        <div className="flex flex-col space-y-5">
          <div className="flex flex-col sm:flex-row justify-between md:items-center">
            <h1>Current User Email </h1>
            {!isEditEmail ? (
              <div className="flex items-center space-x-5">
                {currentUser && (
                  <h1 className="font-semibold flex-grow">
                    {currentUser.email}
                  </h1>
                )}
                <button
                  className="text-blue-500 text-[12px]"
                  onClick={() => setIsEditEmail(!isEditEmail)}>
                  Edit
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-5">
                {/* <h1 className="font-semibold">{currentUser.email}</h1> */}
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                  placeholder="Enter new email"
                  className="flex-grow bg-gray-200 bg-opacity-30 rounded-[10px] border border-[#357112] px-5 py-2"
                />
                <button
                  className={`text-[12px] ${
                    email === initialEmail || email.trim() === ""
                      ? "text-gray-500 "
                      : "text-purple-500 "
                  }`}
                  onClick={handleNewEmailSubmission}
                  disabled={email === initialEmail || email.trim() === ""}>
                  Change
                </button>
                <button
                  className="text-red-500 text-[12px]"
                  onClick={() => setIsEditEmail(!isEditEmail)}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between md:items-center">
              <h1 className="">New Password</h1>
              <input
                type="password"
                name="new_password"
                value={newPassword}
                onChange={handleNewPasswordChange}
                required
                placeholder="Enter your new password"
                className="bg-gray-200 bg-opacity-30 rounded-[10px] border border-[#357112] px-5 py-2"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between md:items-center">
              <h1 className="">Confirm New Password</h1>
              <input
                type="password"
                name="confirm_new_password"
                value={confirmNewPassword}
                onChange={handleConfirmNewPasswordChange}
                required
                placeholder="Re-enter your new password"
                className="bg-gray-200 bg-opacity-30 rounded-[10px] border border-[#357112] px-5 py-2"
              />
            </div>
            <div className="flex justify-between">
              <div />
              <button
                className={`rounded-[10px] border border-[#357112] px-5 py-2 ${
                  newPassword === "" || confirmNewPassword === ""
                    ? "bg-gray-300"
                    : "bg-green-400"
                }`}
                onClick={handleNewPasswordSubmission}
                disabled={newPassword === "" || confirmNewPassword === ""}>
                Change Password
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-5">
          <div>
            <div className="flex flex-col items-start">
              <h1 className="font-semibold">Account Creation for New User </h1>
              <h2 className="text-[13px] italic text-justify text-blue-500">
                Note: When you create an account, the current user will be
                logged out, and the new created account will be logged in
                automatically.
              </h2>
            </div>
            <div className="w-full px-5 border border-green-700" />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between md:items-center">
              <h1 className="">Email</h1>
              <input
                type="email"
                name="create_email"
                value={createEmail}
                onChange={handleCreateEmailChange}
                required
                placeholder="Enter email"
                className="bg-gray-200 bg-opacity-30 rounded-[10px] border border-[#357112] px-5 py-2"
              />
            </div>
            <div className="flex flex-col sm:flex-row justify-between md:items-center">
              <h1 className="">Password</h1>
              <input
                type="password"
                name="create_password"
                value={createPassword}
                onChange={handleCreatePasswordChange}
                required
                placeholder="Enter password"
                className="bg-gray-200 bg-opacity-30 rounded-[10px] border border-[#357112] px-5 py-2"
              />
            </div>
            <div className="flex justify-between">
              <div />
              <button
                className={`rounded-[10px] border border-[#357112] px-5 py-2 ${
                  createPassword === "" || createEmail === ""
                    ? "bg-gray-300"
                    : "bg-green-400"
                }`}
                onClick={handleNewAccount}
                disabled={createPassword === "" || createEmail === ""}>
                Create Account
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col space-y-5">
          <div>
            <h1 className="font-semibold">Settings</h1>
            <div className="w-full px-5 border border-green-700" />
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between md:items-center">
              <h1 className="">School Year</h1>
              <div className="flex justify-between space-x-5">
                <input
                  type="text"
                  name="school_year"
                  value={schoolYear}
                  onChange={handleSchoolYearChange}
                  required
                  placeholder="Enter school year"
                  className="flex-grow bg-gray-200 bg-opacity-30 rounded-[10px] border border-[#357112] px-5 py-2"
                />
                <button
                  className={`rounded-[10px] border border-[#357112] px-5 py-2 ${
                    schoolYear === initialSchoolYear || schoolYear.trim() === ""
                      ? "bg-gray-300"
                      : "bg-green-400"
                  }`}
                  onClick={handleUpdateSchoolYear}
                  disabled={
                    schoolYear === initialSchoolYear || schoolYear.trim() === ""
                  } // Disable the button when they are the same
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
