import React, { useState } from "react";
import TableData from "../TableData/TableData";
import data from "@/data/data";

const Dashboard = () => {
  const [idNumber, setIdNumber] = useState("");
  const [showData, setShowData] = useState(false);

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

  const handleShowData = () => {
    setShowData(!showData);
  };

  /**
   * Change condition here:
   * - to check if id number exists in school year selected (and to check if semester selected is already paid), prompt will show
   * -
   */
  const handleEnterKey = (event) => {
    if (event.key === "Enter") {
      // Check if the ID number already exists in data
      if (data.some((item) => item.id_num === idNumber)) {
        alert("ID number already exists!");
      } else {
        // Add the new data to the data array
        data.push({
          id_num: idNumber,
          school_year: document.getElementById("school_year").value,
          first_sem: document.getElementById("first_sem").value,
          first_sem_date: "",
          second_sem: "unpaid",
          second_sem_date: "",
          college: document.getElementById("college").value,
          date_last_modified: new Date().toISOString().slice(0, 10),
        });
        setIdNumber("");
      }
    }
  };

  return (
    <>
      {!showData ? (
        <div className="w-screen h-screen flex flex-col justify-center px-5 sm:px-10 lg:px-52 xl:px-96">
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
            className="text-[50px] py-10 px-[40px] border-2 rounded-3xl border-[#357112] text-center md:text-right"
          />
          <div className="flex flex-col md:flex-row gap-y-[25px] md:gap-y-0 md:gap-x-[25px] mt-[25px]">
            <div className="w-full hidden md:flex"></div>
            <div className="w-full hidden md:flex"></div>
            <div className="w-full hidden md:flex"></div>
            <div className="w-full hidden md:flex"></div>
            <div className="w-full hidden md:flex"></div>
            <button
              className="w-full bg-[#357112] rounded-3xl py-[25px] px-[50px] text-white"
              onClick={handleShowData}>
              Show Data
            </button>
          </div>
        </div>
      ) : (
        <TableData showData={showData} setShowData={setShowData} />
      )}
    </>
  );
};

export default Dashboard;
