"use client";
import React, { useState, useEffect } from "react";
import { fetchTransactionWithStudentData } from "@/app/data/transaction_data";
import Navbar from "../Navbar/Navbar";
import { handleExportToCSV } from "@/app/tools/exportCSV";
import { fetchEnrolledStudentsCollegeData } from "@/app/data/enrolled_students_data";
import {
  fetchTransactionSchoolYearData,
  fetchTransactionCountTotalData,
} from "@/app/data/transaction_data";

const TableData = () => {
  const [data, setData] = useState([]);
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState(null);
  const [isFilterToggle, setIsFilterToggle] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [uniqueColleges, setUniqueColleges] = useState([]);
  const [uniqueSchoolYears, setUniqueSchoolYears] = useState([]);
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const entriesPerPage = 8;

  const headerNames = [
    "ID Number",
    "First Semester",
    "Second Semester",
    "College",
    "Program",
    "Name",
  ];

  const handleFilterToggle = () => {
    setSelectedSchoolYear(uniqueSchoolYears[0]);
    setSelectedCollege(""), setIsFilterToggle(!isFilterToggle);
    setIsModal(false);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await fetchEnrolledStudentsCollegeData();
        if (error) {
          setError(error);
        } else {
          const uniqueColleges = [...new Set(data.map((item) => item.college))];
          setUniqueColleges(uniqueColleges);
          setSelectedCollege("");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await fetchTransactionSchoolYearData();
        if (error) {
          setError(error);
        } else {
          const uniqueSchoolYears = [
            ...new Set(data.map((item) => item.school_year)),
          ];
          setUniqueSchoolYears(uniqueSchoolYears);
          setSelectedSchoolYear(uniqueSchoolYears[0] || "");
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const { data: student_data, error } =
        await fetchTransactionWithStudentData(
          entriesPerPage,
          currentPage,
          idNumber,
          selectedSchoolYear,
          selectedCollege
        );

      if (error) {
        setError(error);
      } else {
        setData(student_data);
      }
    };

    fetchData();
  }, [
    entriesPerPage,
    currentPage,
    idNumber,
    selectedSchoolYear,
    selectedCollege,
    isFilterToggle,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error, status, count } =
          await fetchTransactionCountTotalData(
            idNumber,
            selectedSchoolYear,
            selectedCollege
          );
        if (error) {
          setError(error);
        } else {
          setTotalAmount(count * 100);
        }
      } catch (error) {
        console.error("An error occurred:", error);
        setError(error);
      }
    };

    fetchData();
  }, [idNumber, selectedSchoolYear, selectedCollege, isFilterToggle]);

  const handleButtonDone = () => {
    setIsModal(false);
    setIsBtnClicked(true);
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-screen h-[100dvh] flex flex-col">
      <Navbar />
      <div
        className={`${
          isModal ? "overflow-hidden" : "overflow-auto"
        } w-full flex flex-col py-3 px-4 mb-6 xl:py-5 sm:px-8 lg:px-16 xl:px-24 sm:rounded-lg`}>
        <div className="w-full flex justify-between flex-col md:flex-row gap-y-[10px] md:gap-y-0 mb-[25px] select-none">
          <div className="flex items-center gap-x-[10px] md:gap-x-[25px]">
            <input
              value={idNumber}
              onChange={handleChange}
              className="w-full rounded-3xl py-[10px] border-2 border-[#357112] text-center"
              type="text"
              name="search"
              id="search"
              placeholder="Search ID Number"
            />
            <button
              onClick={handleFilterToggle}
              className={`${
                isFilterToggle ? "bg-green-600" : "bg-[#357112]"
              } rounded-3xl py-[10px] px-[50px] text-white`}>
              Filter
            </button>
            {isFilterToggle ? (
              <button
                className="bg-green-500 rounded-3xl text-white py-[10px] px-[20px]"
                onClick={() => setIsModal(!isModal)}>
                ▼
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="flex items-center gap-x-[10px] md:gap-x-[25px] justify-end">
            <p className="w-full bg-[#357112] rounded-3xl py-[10px] px-[30px] text-white">
              Total: {totalAmount}
            </p>
            <button
              className="border border-[#357112] rounded-3xl py-[10px] px-[20px]"
              onClick={handleExportToCSV}>
              ▼
            </button>
          </div>
        </div>
        <div className="w-full overflow-x-auto rounded-t-3xl h-[70vh]">
          <table className="w-full text-sm text-center">
            <thead className="text-xs uppercase bg-[#357112] text-white">
              <tr>
                {headerNames.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="bg-white border-b border-green-700 hover:bg-green-300">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap font-mono">
                    {item.id_num}
                  </th>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.first_sem === true ? "paid" : "unpaid"}
                    <br />
                    <span className="text-purple-900 italic font-mono">
                      {item.first_sem_date}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.second_sem === true ? "paid" : "unpaid"}
                    <br />
                    <span className="text-purple-900 italic font-mono">
                      {item.second_sem_date}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.enrolled_students.college}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {item.enrolled_students.stud_program}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {`${item.enrolled_students.lastname}, ${item.enrolled_students.firstname}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {isModal ? (
          <div className="z-50 fixed top-0 left-0 w-screen h-[100dvh] flex justify-center items-center bg-black bg-opacity-50">
            <div className="w-full flex flex-col md:w-96 bg-white rounded-lg p-6 mx-5">
              <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
              <div className="mb-4">
                <label htmlFor="schoolYear" className="block text-gray-600">
                  School Year:
                </label>
                <select
                  id="schoolYear"
                  name="schoolYear"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={selectedSchoolYear}
                  onChange={(e) => setSelectedSchoolYear(e.target.value)}>
                  <option value="">All</option>
                  {uniqueSchoolYears.map((schoolYear, index) => (
                    <option key={index} value={schoolYear}>
                      {schoolYear}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="college" className="block text-gray-600">
                  College:
                </label>
                <select
                  id="college"
                  name="college"
                  className="w-full border border-gray-300 rounded-md p-2"
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}>
                  <option value="">All</option>
                  {uniqueColleges.map((college, index) => (
                    <option key={index} value={college}>
                      {college}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleButtonDone}
                className="bg-[#357112] text-white rounded-md p-2 self-end">
                Done
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
        <div className="w-full mt-4 flex self-end justify-end select-none">
          <button
            className={`${
              currentPage === 1
                ? "bg-white text-white"
                : "bg-[#357112] text-white"
            } rounded-3xl py-2 px-5 mx-2`}
            onClick={handlePrevPage}
            disabled={currentPage === 1}>
            {"<"}
          </button>
          <button
            className={`${
              data.length < entriesPerPage
                ? "bg-white text-white"
                : "bg-[#357112] text-white"
            } rounded-3xl py-2 px-5 mx-2`}
            onClick={handleNextPage}
            disabled={data.length < entriesPerPage}>
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableData;
