import React, { useState } from "react";
import initialData from "@/data/data";

const TableData = ({ showData, setShowData }) => {
  const [data, setData] = useState(initialData);
  const handleButtonClick = () => {
    setShowData(!showData);
  };

  const headerNames = [
    "ID Number",
    "School Year",
    "First Semester",
    "Second Semester",
    "College",
    "",
    "",
  ];

  const [idNumber, setIdNumber] = useState("");

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

  const handleDelete = (idNum, schoolYear) => {
    const newData = data.filter(
      (item) => !(item.id_num === idNum && item.school_year === schoolYear)
    );
    setData(newData); // Assuming you have a 'setData' function to update the data state
  };

  return (
    <div className="w-screen h-screen px-4 py-6 sm:py-8 lg:py-10 xl:py-12 sm:px-8 lg:px-16 xl:px-24 shadow-md sm:rounded-lg">
      <div className="flex gap-x-[25px] w-full mb-[25px]">
        <input
          value={idNumber}
          onChange={handleChange}
          className="w-full rounded-3xl border-2 border-[#357112] text-center grow-[5]"
          type="text"
          name="search"
          id="search"
          placeholder="Search ID Number"
        />
        <button
          onClick={handleButtonClick}
          className="w-full bg-[#357112] rounded-3xl py-[25px] px-[50px] text-white grow-[1]">
          Pay
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-center">
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
            {filteredData.map((item, index) => (
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
                  {item.first_sem === "true" ? "paid" : "unpaid"}
                  {<br />}
                  <span className="text-purple-900 italic">
                    {item.first_sem_date}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {item.second_sem === "true" ? "paid" : "unpaid"}
                  {<br />}
                  <span className="text-purple-900 italic">
                    {item.second_sem_date}
                  </span>
                </td>
                <td className="px-6 py-4">{item.college}</td>

                <td className="px-6 py-4 text-right">
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline">
                    Edit
                  </a>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    className="font-medium text-red-600 hover:underline"
                    onClick={() => handleDelete(item.id_num, item.school_year)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableData;
