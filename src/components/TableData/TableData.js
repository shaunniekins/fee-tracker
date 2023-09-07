import React, { useState, useEffect } from "react";
import { fetchStudentData } from "@/app/data/new_data";
import Navbar from "../Navbar/Navbar";

const TableData = () => {
  const [data, setData] = useState([]);
  const [idNumber, setIdNumber] = useState("");
  const [error, setError] = useState(null);

  const headerNames = [
    "ID Number",
    "School Year",
    "First Semester",
    "Second Semester",
    "College",
  ];

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

  // Filter data based on idNumber
  const filteredData = data.filter((item) => item.id_num.includes(idNumber));

  useEffect(() => {
    const fetchData = async () => {
      const { data: student_data, error } = await fetchStudentData();

      if (error) {
        setError(error);
      } else {
        setData(student_data);
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

  return (
    <div className="w-screen h-screen flex flex-col">
      <Navbar />
      <div className="w-full flex flex-col py-3 px-4 mb-6 xl:py-5 sm:px-8 lg:px-16 xl:px-24 shadow-md sm:rounded-lg">
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
              // onClick={handleButtonClick}
              className="bg-[#357112] rounded-3xl py-[10px] px-[50px] text-white">
              Filter
            </button>
          </div>
          <p className="bg-[#357112] rounded-3xl py-[10px] px-[30px] text-white">
            Total: {total}
          </p>
        </div>
        <div className="overflow-x-auto rounded-t-3xl">
          <table className="w-full text-sm text-center ">
            <thead className="text-xs uppercase bg-[#357112] text-white">
              <tr>
                {headerNames.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-3 py-2 sm:px-4 sm:py-3">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData
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
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                      {item.id_num}
                    </th>
                    <td className="px-6 py-4">{item.school_year}</td>
                    <td className="px-6 py-4">
                      {item.first_sem === true ? "paid" : "unpaid"}
                      {<br />}
                      <span className="text-purple-900 italic">
                        {item.first_sem_date}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {item.second_sem === true ? "paid" : "unpaid"}
                      {<br />}
                      <span className="text-purple-900 italic">
                        {item.second_sem_date}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.college}</td>
                  </tr>
                ))}
            </tbody>
            {/* <tfoot>
              <tr className="font-semibold text-gray-900 bg-green-100">
                <th scope="row" className="px-3 py-2 sm:px-4 sm:py-3 text-left">
                  Total
                </th>
                <td className="px-6 py-2">{""}</td>
                <td className="px-6 py-2">{""}</td>
                <td className="px-6 py-2">{""}</td>
                <td className="px-6 py-2 text-right">{total}</td>
              </tr>
            </tfoot> */}
          </table>
        </div>
      </div>
    </div>
  );
};

export default TableData;
