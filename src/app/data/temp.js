"use client";

//temp history
import React, { useState, useEffect } from "react";
import { fetchStudentData } from "@/app/data/new_data";

const History = () => {
  const [idNumber, setIdNumber] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [yesterdayDate, setYesterdayDate] = useState("");

  useEffect(() => {
    // Process the data fetched using fetchStudentData
    const processData = async () => {
      try {
        const { data, error } = await fetchStudentData(); // Use fetchStudentData to get student data

        if (error) {
          console.error("Error fetching student data:", error);
          return;
        }

        const groupedData = {};

        data.forEach((item) => {
          const firstSemDate = new Date(item.first_sem_date);
          const secondSemDate = item.second_sem
            ? new Date(item.second_sem_date)
            : null;
          const dateKeyFirst = firstSemDate.toDateString();
          const dateKeySecond = secondSemDate
            ? secondSemDate.toDateString()
            : "";

          if (!groupedData[dateKeyFirst]) {
            groupedData[dateKeyFirst] = [];
          }
          if (
            secondSemDate &&
            (item.second_sem === "true" || item.second_sem_time !== "")
          ) {
            groupedData[dateKeySecond] = groupedData[dateKeySecond] || [];
            groupedData[dateKeySecond].push({ ...item, semester: "Second" });
          }

          groupedData[dateKeyFirst].push({ ...item, semester: "First" });
        });

        // Sort the data within each group by the newest time
        for (const key in groupedData) {
          groupedData[key].sort((a, b) => {
            const timeA =
              a.semester === "First" ? a.first_sem_time : a.second_sem_time;
            const timeB =
              b.semester === "First" ? b.first_sem_time : b.second_sem_time;
            return (
              new Date(`1970-01-01T${timeB}`) - new Date(`1970-01-01T${timeA}`)
            );
          });
        }

        // Set the filtered and sorted data
        setFilteredData(groupedData);

        // Get the current date
        const today = new Date();

        // Get the date for yesterday by subtracting one day (24 hours) from the current date
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        const options = {
          weekday: "long",
          month: "long",
          day: "2-digit",
          year: "numeric",
        };
        const formattedCurrentDate = today.toLocaleDateString(
          undefined,
          options
        );
        const formattedYesterdayDate = yesterday.toLocaleDateString(
          undefined,
          options
        );

        // Set the state variables
        setCurrentDate(formattedCurrentDate);
        setYesterdayDate(formattedYesterdayDate);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    processData();
  }, []);

  // Function to format date string
  function formatDateString(dateString) {
    const options = {
      weekday: "long",
      month: "long",
      day: "2-digit", // Use 2-digit to include leading zeros
      year: "numeric",
    };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  }

  // Function to format time string
  function formatTimeString(timeString) {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    const timeParts = timeString.split(":");
    const time = new Date(0, 0, 0, timeParts[0], timeParts[1], timeParts[2]);
    return time.toLocaleTimeString(undefined, options);
  }

  const sortedDateKeys = Object.keys(filteredData).sort((a, b) => {
    const dateA = new Date(formatDateString(a));
    const dateB = new Date(formatDateString(b));
    return dateB - dateA; // Sort in descending order (latest first)
  });

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

  return (
    <div className="w-screen flex flex-col px-5 py-3 sm:px-10 lg:px-52 xl:px-[600px] font-Montserrat">
      <div className="flex flex-col md:flex-row gap-y-[25px] md:gap-y-0 md:gap-x-[25px] w-full mb-[25px]">
        <input
          value={idNumber}
          onChange={handleChange}
          className="w-full rounded-3xl py-[10px] px-[50px] border-2 border-[#357112] text-center"
          type="text"
          name="search"
          id="search"
          placeholder="Search ID Number"
        />
      </div>
      <div className="w-full flex flex-col space-y-3">
        {sortedDateKeys.map((dateKey) => (
          <div
            key={dateKey}
            className="flex flex-col rounded-3xl border-2 border-[#357112] bg-green-100 p-5">
            <div className="flex justify-between items-center">
              <h4 className="font-semibold text-lg">
                {currentDate === formatDateString(dateKey)
                  ? `Today - ${formatDateString(dateKey)}`
                  : yesterdayDate === formatDateString(dateKey)
                  ? `Yesterday - ${formatDateString(dateKey)}`
                  : formatDateString(dateKey)}
              </h4>

              <p>Total: {filteredData[dateKey].length * 100}</p>
            </div>
            <div className="border-b-2 border-[#357112] my-3" />
            <div className="flex flex-col space-y-3">
              {filteredData[dateKey].map((item, index) => (
                <div
                  key={`${item.id_num}-${index}`}
                  className="flex space-x-10 items-center">
                  <p className="text-xs">
                    {item.semester === "First"
                      ? formatTimeString(item.first_sem_time)
                      : formatTimeString(item.second_sem_time)}
                  </p>
                  <p>
                    <span className="text-red-500 font-medium">
                      {item.id_num}
                    </span>{" "}
                    paid for the {item.semester.toLowerCase()} semester.
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;