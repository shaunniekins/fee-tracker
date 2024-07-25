"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

import Navbar from "../../components/Navbar/Navbar";
import Indicator from "../../components/Indicator/Indicator";
import QRCodeScanner from "../../components/QrScanner/QrScanner";

import {
  fetchTransactionData,
  insertTransactionData,
  updateTransactionData,
} from "@/data/transaction_data";
import { fetchSettingsData } from "@/data/settings_data";

const Dashboard = () => {
  const [idNumber, setIdNumber] = useState("");
  const [indicatorMsg, setIndicatorMsg] = useState("");
  const [indicatorStatus, setIndicatorStatus] = useState(true);
  const [qrScannerVisible, setQrScannerVisible] = useState(false);

  const defaultSemester = localStorage.getItem("semester") || "1st Semester";
  const defaultCollege = localStorage.getItem("college") || "CAA";

  const [semester, setSemester] = useState(defaultSemester);
  const [college, setCollege] = useState(defaultCollege);
  const [schoolYear, setSchoolYear] = useState(" - ");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: settingsData } = await fetchSettingsData();
        const settings = settingsData;

        settingsData && setSchoolYear(settings[0].school_year);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    localStorage.setItem("semester", semester);
    localStorage.setItem("college", college);
  }, [semester, college]);

  const handleQRScan = (data) => {
    setIdNumber(data);
    setQrScannerVisible(false);
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (numericValue.length <= 8) {
      let formattedValue = numericValue;

      if (numericValue.length > 3) {
        formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
      }

      setIdNumber(formattedValue);
    }
  };

  const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();

      handlePay();
    }
  };

  const handleTimeout = () => {
    setTimeout(() => {
      setIndicatorMsg("");
      setIndicatorStatus(true);
    }, 3000);
  };

  const handlePay = async () => {
    const school_year = schoolYear;
    const semester = document.getElementById("semester").value;

    if (idNumber.length !== 9) {
      if (idNumber.length === 0) {
        return;
      } else {
        setIndicatorMsg("ID number inputted is short.");
        setIndicatorStatus(false);
        handleTimeout();
        return;
      }
    }

    const { data: existingStudentData } = await fetchTransactionData(idNumber);
    const existingStudent = existingStudentData.find(
      (item) => item.id_num === idNumber
    );

    if (existingStudent) {
      if (semester === "2nd Semester" && existingStudent.first_sem !== true) {
        setIndicatorMsg("Student needs to pay the first semester first.");
        setIndicatorStatus(false);
        handleTimeout();
      } else if (
        semester === "2nd Semester" &&
        existingStudent.second_sem === true
      ) {
        setIndicatorMsg("Student already paid for both semesters.");
        setIndicatorStatus(false);
        handleTimeout();
      } else if (
        semester === "2nd Semester" &&
        existingStudent.first_sem === true &&
        existingStudent.second_sem !== true
      ) {
        // Update existing student's data for 2nd semester
        const now = new Date();

        const localDate = now.toLocaleDateString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        const updateData = {
          second_sem: true,
          second_sem_date: localDate,
          second_sem_time: now.toLocaleTimeString(),
          date_last_modified: `${localDate} ${now.toLocaleTimeString()}`,
        };
        await updateTransactionData(idNumber, school_year, updateData);

        setIdNumber("");
        setIndicatorMsg("Paid successfully");
        setIndicatorStatus(true);
        handleTimeout();
      } else if (
        semester === "1st Semester" &&
        existingStudent.first_sem === true
      ) {
        setIndicatorMsg("Student already paid for the first semester.");
        setIndicatorStatus(false);
        handleTimeout();
      } else if (
        semester === "1st Semester" &&
        existingStudent.first_sem !== true
      ) {
        setIndicatorMsg("Student needs to pay the first semester.");
        setIndicatorStatus(false);
        handleTimeout();
      }
    } else {
      if (semester === "2nd Semester") {
        setIndicatorMsg("Student needs to pay the first semester first.");
        setIndicatorStatus(false);
        handleTimeout();
      } else {
        // const { data: enrolledStudentData } = await fetchEnrolledStudentsData();
        // const enrolledStudent = enrolledStudentData.find(
        //   (item) => item.idnumber === idNumber
        // );

        // // not recommended: but need to utilize
        // if (!enrolledStudent) {
        //   const enrollNewStudent = {
        //     idnumber: idNumber,
        //   };
        //   await insertEnrolledStudentData(enrollNewStudent);
        // }

        // Add new student's data for 1st semester
        const now = new Date();
        // Get the current date in the user's local time zone
        const localDate = now.toLocaleDateString(undefined, {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        });

        const newStudent = {
          id_num: idNumber,
          school_year: school_year,
          first_sem: semester === "1st Semester" ? true : false,
          first_sem_date: localDate,
          first_sem_time: now.toLocaleTimeString(),
          second_sem: false,
          second_sem_date: null,
          second_sem_time: null,
          college: document.getElementById("college").value,
          date_last_modified: `${localDate} ${now.toLocaleTimeString()}`,
        };

        await insertTransactionData(newStudent);
        setIdNumber("");
        setIndicatorMsg("Paid successfully");
        setIndicatorStatus(true);
        handleTimeout();
      }
    }
  };

  return (
    <>
      {!qrScannerVisible ? (
        <div className="flex flex-col md:hidden justify-center items-center mt-[40px] mb-[-10px] ">
          <Image
            src="logo-enhanced.png"
            alt="Logo"
            width={80}
            height={80}
          />
          <h1 className="flex flex-col space-y-[-2px] text-center">
            {" "}
            <span className="text-md font-semibold">Fee Tracker</span>
            <span className="tracking-wider font-mono font-[500] text-[8px]">
              Est. 2023-2024
            </span>
          </h1>
        </div>
      ) : (
        ""
      )}
      <div className="flex flex-col flex-grow justify-center py-3 px-5 md:px-0 2xl:px-64 font-Montserrat ">
        {/* py-3 md:py-7 px-5 sm:px-10 lg:px-52 2xl:px-[350px] */}
        {indicatorMsg && !qrScannerVisible && (
          <Indicator msg={indicatorMsg} status={indicatorStatus} />
        )}
        {qrScannerVisible ? (
          <div className="z-0 w-[100%] md:w-[500px] mt-[-50px] self-center font-Montserrat text-center flex flex-col text-xl font-semibold">
            <button
              className="md:hidden self-center"
              onClick={() => setQrScannerVisible(!qrScannerVisible)}>
              <Image
                src="logo-enhanced.png"
                alt="Logo"
                width={80}
                height={80}
              />
            </button>
            <button
              className="text-center"
              onClick={() => setQrScannerVisible(!qrScannerVisible)}>
              Scan ID
            </button>

            {/* Render the QR Scanner component */}
            <QRCodeScanner
              onScan={(data) => handleQRScan(data)}
              toggleQrScanner={() => setQrScannerVisible(!qrScannerVisible)}
            />
          </div>
        ) : (
          <>
            <div className="w-full flex flex-col md:flex-row gap-y-[25px] md:gap-y-0 md:gap-x-[25px] mb-[25px] text-[20px]">
              <select
                className="w-full py-[25px] rounded-3xl bg-transparent border-2 border-[#357112] text-center appearance-none"
                id="semester"
                name="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}>
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
              </select>
              {semester === "2nd Semester" && <div className="w-full" />}
              {semester === "1st Semester" && (
                <p
                  className="w-full py-[25px] rounded-3xl border-2
                border-[#357112] text-center">
                  {schoolYear}
                </p>
              )}

              {semester === "1st Semester" ? (
                <select
                  className="w-full py-[25px] rounded-3xl bg-transparent border-2 border-[#357112] text-center appearance-none"
                  id="college"
                  name="college"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}>
                  <option value="CAA">CAA</option>
                  <option value="CCIS">CCIS</option>
                  <option value="CEd">CEd</option>
                  <option value="CEGS">CEGS</option>
                  <option value="CFES">CFES</option>
                  <option value="CHaSS">CHaSS</option>
                  <option value="CMNS">CMNS</option>
                  <option value="SS">SS</option>
                </select>
              ) : (
                <div className="w-full" />
              )}
            </div>
            <div className="w-full relative">
              <input
                type="text"
                value={idNumber}
                onChange={handleChange}
                onKeyDown={handleEnterKey}
                placeholder="ID Number"
                className="w-full text-[33px] md:text-[50px] py-10 px-[40px] border-2 rounded-3xl border-[#357112] text-right"
              />
              <div className="absolute left-0 top-0 bottom-0 flex items-center pl-[40px]">
                <button
                  className=""
                  onClick={() => setQrScannerVisible(!qrScannerVisible)}>
                  <Image
                    src="camera-outline.svg"
                    alt="Camera Icon"
                    width={48}
                    height={48}
                  />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-y-[25px] md:gap-y-0 md:gap-x-[25px] mt-[25px]">
              <div className="w-full hidden md:flex"></div>
              <div className="w-full hidden md:flex"></div>
              <div className="w-full hidden md:flex"></div>
              <div className="w-full hidden md:flex"></div>
              <div className="w-full hidden md:flex"></div>
              <button
                className="w-full order-1 md:order-7 bg-[#357112] hover:bg-purple-500 rounded-3xl py-[25px] px-[50px] text-white transition delay-75 duration-300 ease-in-out"
                onClick={handlePay}>
                Pay
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
