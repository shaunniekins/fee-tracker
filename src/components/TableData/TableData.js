import React, { useState, useEffect } from "react";
import { fetchStudentData } from "@/app/data/new_data";
import Navbar from "../Navbar/Navbar";

const TableData = () => {
  const [data, setData] = useState([]);
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState(null);
  const [isFilterToggle, setIsFilterToggle] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [selectedSchoolYear, setSelectedSchoolYear] = useState("");
  const [uniqueColleges, setUniqueColleges] = useState([]);
  const [uniqueSchoolYears, setUniqueSchoolYears] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState(8);

  const headerNames = [
    "ID Number",
    "First Semester",
    "Second Semester",
    "College",
  ];

  const handleFilterToggle = () => {
    setIsFilterToggle(!isFilterToggle);
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

  let filteredData;

  if (isFilterToggle) {
    filteredData = data.filter((item) => {
      return (
        item.id_num.includes(idNumber) &&
        (selectedCollege === "" || item.college === selectedCollege) &&
        (selectedSchoolYear === "" || item.school_year === selectedSchoolYear)
      );
    });
  } else {
    filteredData = data.filter((item) => {
      return item.id_num.includes(idNumber);
    });
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data: student_data, error } = await fetchStudentData();

      if (error) {
        setError(error);
      } else {
        setData(student_data);

        // Extract unique college and school_year values
        const uniqueColleges = [
          ...new Set(student_data.map((item) => item.college)),
        ];
        const uniqueSchoolYears = [
          ...new Set(student_data.map((item) => item.school_year)),
        ];

        setUniqueColleges(uniqueColleges);
        setUniqueSchoolYears(uniqueSchoolYears);

        setSelectedCollege(""); // Set default to an empty string
        setSelectedSchoolYear(uniqueSchoolYears[0] || ""); // Set default to the first option
      }
    };

    fetchData();
  }, []);

  const trueCountFirstSem = filteredData.filter(
    (item) => item.first_sem
  ).length;
  const trueCountSecondSem = filteredData.filter(
    (item) => item.second_sem
  ).length;

  // Calculate the total by multiplying the counts by 100
  const total = (trueCountFirstSem + trueCountSecondSem) * 100;

  const handleExportToCSV = () => {
    // Get the current date in the format YYYY/MM/DD
    const currentDate = new Date().toISOString().slice(0, 10);

    // Create a file name with the current date
    const fileName = `[${currentDate}] - LCO Fee Student List.csv`;

    // Convert data to CSV format with the specified column order
    const csvData = [
      "ID Number,First Semester,First Semester Date,Second Semester,Second Semester Date,College",
      ...filteredData.map((item) =>
        [
          `"${item.id_num}"`,
          `"${item.first_sem === true ? "paid" : "unpaid"}"`,
          `"${item.first_sem_date}"`,
          `"${item.second_sem === true ? "paid" : "unpaid"}"`,
          `"${item.second_sem_date}"`,
          `"${item.college}"`,
        ].join(",")
      ),
    ].join("\n");

    // Create a Blob containing the CSV data
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    const response = confirm("Do you want to download the CSV file?");

    if (response) {
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName; // Set the file name with the current date
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  // Pagination functions
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(
    indexOfFirstEntry,
    indexOfLastEntry
  );

  const handleNextPage = () => {
    if (indexOfLastEntry < filteredData.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col">
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
                isFilterToggle ? "bg-purple-500" : "bg-[#357112]"
              } rounded-3xl py-[10px] px-[50px] text-white`}>
              Filter
            </button>
            {isFilterToggle ? (
              <button
                className="bg-pink-200 rounded-3xl py-[10px] px-[20px]"
                onClick={() => setIsModal(!isModal)}>
                ▼
              </button>
            ) : (
              ""
            )}
          </div>
          <div className="flex items-center gap-x-[10px] md:gap-x-[25px] justify-end">
            <p className="w-full bg-[#357112] rounded-3xl py-[10px] px-[30px] text-white">
              Total: {total}
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
              {currentEntries
                .sort((a, b) => {
                  return (
                    new Date(b.date_last_modified) -
                    new Date(a.date_last_modified)
                  );
                })
                .map((item, index) => (
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
                      {item.college}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {isModal ? (
          <div className="z-50 fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black bg-opacity-50">
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
                onClick={() => setIsModal(false)}
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
            {`<`}
          </button>
          <button
            className={`${
              indexOfLastEntry >= filteredData.length
                ? "bg-white text-white"
                : "bg-[#357112] text-white"
            } rounded-3xl py-2 px-5 mx-2`}
            onClick={handleNextPage}
            disabled={indexOfLastEntry >= filteredData.length}>
            {`>`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableData;
