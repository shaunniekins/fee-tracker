import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Indicator from "../Indicator/Indicator";
import {
  fetchStudentData,
  insertStudentData,
  updateStudentData,
} from "@/app/data/new_data";

const Dashboard = () => {
  const [idNumber, setIdNumber] = useState("");
  const [indicatorMsg, setIndicatorMsg] = useState("");
  const [indicatorStatus, setIndicatorStatus] = useState(true);

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
      event.preventDefault(); // Prevent the default form submission behavior

      handlePay();
    }
  };

  const handleTimeout = () => {
    setTimeout(() => {
      setIndicatorMsg(""); // Clear the message
      setIndicatorStatus(true); // Hide the indicator
    }, 3000); // 3000 milliseconds (3 seconds)
  };

  const handlePay = async () => {
    const schoolYear = document.getElementById("school_year").value;
    const semester = document.getElementById("semester").value;

    if (idNumber.length !== 9) {
      setIndicatorMsg("ID number inputted is short."); // Update indicator message
      setIndicatorStatus(false); // Update indicator status
      handleTimeout();
      return;
    }

    const { data: existingStudentData } = await fetchStudentData();
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
        await updateStudentData(idNumber, schoolYear, updateData);

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
          school_year: schoolYear,
          first_sem: semester === "1st Semester" ? true : false,
          first_sem_date: localDate,
          first_sem_time: now.toLocaleTimeString(),
          second_sem: false,
          second_sem_date: null,
          second_sem_time: null,
          college: document.getElementById("college").value,
          date_last_modified: `${localDate} ${now.toLocaleTimeString()}`,
        };

        await insertStudentData(newStudent);
        setIdNumber("");
        setIndicatorMsg("Paid successfully");
        setIndicatorStatus(true);
        handleTimeout();
      }
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-col flex-grow justify-center py-3  px-5 sm:px-10 lg:px-52 xl:px-96 font-Montserrat select-none">
        {indicatorMsg && (
          <Indicator msg={indicatorMsg} status={indicatorStatus} />
        )}
        <div className="flex flex-col md:flex-row gap-y-[25px] md:gap-y-0 md:gap-x-[25px] mb-[25px] text-[20px]">
          <input
            className="w-full py-[25px] rounded-3xl border-2 border-[#357112] text-center"
            type="text"
            name="school_year"
            id="school_year"
            defaultValue={"2023-2024"}
          />
          <select
            className="w-full py-[25px] rounded-3xl bg-transparent border-2 border-[#357112] text-center appearance-none"
            id="semester"
            name="semester">
            <option value="1st Semester">1st Semester</option>
            <option value="2nd Semester">2nd Semester</option>
          </select>
          <select
            className="w-full py-[25px] rounded-3xl bg-transparent border-2 border-[#357112] text-center appearance-none"
            id="college"
            name="college">
            <option value="CAA">CAA</option>
            <option value="CCIS">CCIS</option>
            <option value="CED">CED</option>
            <option value="CEGS">CEGS</option>
            <option value="CHASS">CHASS</option>
            <option value="CMNS">CMNS</option>
            <option value="COFES">COFES</option>
          </select>
          <div className="w-full"></div>
        </div>
        <input
          type="text"
          value={idNumber}
          onChange={handleChange}
          onKeyDown={handleEnterKey} // Call handleEnterKey on key down
          placeholder="ID Number"
          className="text-[40px] md:text-[50px] py-10 px-[40px] border-2 rounded-3xl border-[#357112] text-center md:text-right"
        />
        <div className="flex flex-col md:flex-row gap-y-[25px] md:gap-y-0 md:gap-x-[25px] mt-[25px]">
          <div className="w-full hidden md:flex"></div>
          <div className="w-full hidden md:flex"></div>
          <div className="w-full hidden md:flex"></div>
          <div className="w-full hidden md:flex"></div>
          <div className="w-full hidden md:flex"></div>
          {/* <button
            className="w-full order-2 md:order-6 bg-[#357112] rounded-3xl py-[25px] px-[50px] text-white "
            // onClick={handleShowData}
          >
            Show Data
          </button> */}
          <button
            className="w-full order-1 md:order-7 bg-green-600 hover:bg-red-400 rounded-3xl py-[25px] px-[50px] text-white"
            onClick={handlePay}>
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
