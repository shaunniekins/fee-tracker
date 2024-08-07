"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { fetchTransactionWithStudentData } from "@/data/transaction_data";

const History = () => {
  const [idNumber, setIdNumber] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [currentDate, setCurrentDate] = useState("");
  const [yesterdayDate, setYesterdayDate] = useState("");
  const [currPage, setCurrPage] = useState(1);
  const [countDataAvailable, setCountDataAvailable] = useState(0);
  const itemsPerPage = 20;

  const listInnerRef = useRef();

  const fetchData = useMemo(
    () => async () => {
      try {
        const { data, error, count } = await fetchTransactionWithStudentData(
          itemsPerPage,
          currPage,
          idNumber || "",
          "",
          ""
        );
        setCountDataAvailable(count);

        if (error) {
          console.error("Error fetching student data:", error);
          return;
        }

        const updatedData = [...filteredData];

        data.forEach((item) => {
          const firstSemDate = new Date(item.first_sem_date);
          const secondSemDate = item.second_sem
            ? new Date(item.second_sem_date)
            : null;
          const dateKeyFirst = firstSemDate.toDateString();
          const dateKeySecond = secondSemDate
            ? secondSemDate.toDateString()
            : "";

          // Add the new item to the appropriate group
          if (
            secondSemDate &&
            (item.second_sem === "true" || item.second_sem_time !== "")
          ) {
            const index = updatedData.findIndex(
              (d) => d.date === dateKeySecond
            );
            if (index !== -1) {
              updatedData[index].data.push({ ...item, semester: "Second" });
            } else {
              updatedData.push({
                date: dateKeySecond,
                data: [{ ...item, semester: "Second" }],
              });
            }
          }

          const index = updatedData.findIndex((d) => d.date === dateKeyFirst);
          if (index !== -1) {
            updatedData[index].data.push({ ...item, semester: "First" });
          } else {
            updatedData.push({
              date: dateKeyFirst,
              data: [{ ...item, semester: "First" }],
            });
          }
        });

        // Sort the data within each group by the newest time
        updatedData.forEach((group) => {
          group.data.sort((a, b) => {
            const timeA =
              a.semester === "First" ? a.first_sem_time : a.second_sem_time;
            const timeB =
              b.semester === "First" ? b.first_sem_time : b.second_sem_time;
            return (
              new Date(`1970-01-01T${timeB}`) - new Date(`1970-01-01T${timeA}`)
            );
          });
        });

        // Set the filtered and sorted data
        setFilteredData(updatedData);

        const today = new Date();
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

        setCurrentDate(formattedCurrentDate);
        setYesterdayDate(formattedYesterdayDate);
      } catch (error) {
        console.error("An error occurred:", error);
      }
    },
    [itemsPerPage, currPage, idNumber]
  );

  useEffect(() => {
    // Call the memoized fetchData function when inputs change
    fetchData();
  }, [fetchData]); // Note that you can depend on the memoized function itself

  // Function to format date string
  const formatDateString = useMemo(
    () => (dateString) => {
      const options = {
        weekday: "long",
        month: "long",
        day: "2-digit",
        year: "numeric",
      };
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, options);
    },
    []
  );

  // Function to format time string
  const formatTimeString = useMemo(
    () => (timeString) => {
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      const timeParts = timeString.split(":");
      const time = new Date(0, 0, 0, timeParts[0], timeParts[1], timeParts[2]);
      return time.toLocaleTimeString(undefined, options);
    },
    []
  );

  const handleChange = (event) => {
    const inputValue = event.target.value;
    const numericValue = inputValue.replace(/[^0-9]/g, "");

    if (numericValue.length <= 8) {
      let formattedValue = numericValue;

      if (numericValue.length > 3) {
        formattedValue = `${numericValue.slice(0, 3)}-${numericValue.slice(3)}`;
      }

      setIdNumber(formattedValue);
      setCurrPage(1);
      setFilteredData([]);
    }
  };

  const handleScroll = () => {
    // if (listInnerRef.current) {
    //   const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;

    //   if (scrollTop + clientHeight >= scrollHeight - 10 && !wasLastList) {
    //     // When you are near the bottom (adjust the threshold as needed) and not at the end
    //     setCurrPage(currPage + 1); // Increment the page number
    //   }
    // }
    if (countDataAvailable >= currPage * itemsPerPage) {
      // Load more data only if there is more data available
      setCurrPage(currPage + 1);
    }
  };

  return (
    <>
      <div className="flex flex-col py-3 md:py-7 px-5 sm:px-10 lg:px-52 2xl:px-[350px] font-Montserrat">
        {/* px-5 md:px-0 py-3 md:py-7 */}
        <div className="self-end mb-[25px] select-none">
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
        <div
          className="w-full flex flex-col space-y-3 overflow-y-auto"
          // onScroll={handleScroll}
          // ref={listInnerRef}
        >
          {filteredData.map((group, groupIndex) => (
            <div
              key={groupIndex}
              className="flex flex-col rounded-3xl border-2 border-[#357112] bg-green-100 p-5">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <h4 className="font-semibold text-md md:text-lg">
                  {currentDate === formatDateString(group.date)
                    ? `Today - ${formatDateString(group.date)}`
                    : yesterdayDate === formatDateString(group.date)
                    ? `Yesterday - ${formatDateString(group.date)}`
                    : formatDateString(group.date)}
                </h4>
                <p className="text-sm mt-3 md:mt-0 md:self-center">
                  Total: {group.data.length * 100}
                </p>
              </div>
              <div className="border-b-2 border-[#357112] my-3" />
              <div className="flex flex-col space-y-3">
                {group.data.map((item, itemIndex) => (
                  <div
                    key={`${item.id_num}-${itemIndex}`}
                    className="flex space-x-5 sm:space-x-10 items-center">
                    <p className="text-xs font-mono">
                      {item.semester === "First"
                        ? formatTimeString(item.first_sem_time)
                        : formatTimeString(item.second_sem_time)}
                    </p>
                    <p className="space-x-2">
                      <span className="text-purple-700 font-mono font-semibold">
                        {item.id_num}
                      </span>{" "}
                      <span className="font-Montserrat">
                        paid for the {item.semester.toLowerCase()} semester.
                      </span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          className={` self-center py-2 px-3 rounded-full mt-5 ${
            countDataAvailable >= currPage * itemsPerPage && "bg-green-200"
          }`}
          onClick={handleScroll}
          disabled={!(countDataAvailable >= currPage * itemsPerPage)}>
          {countDataAvailable >= currPage * itemsPerPage && "Load More"}
        </button>
      </div>
    </>
  );
};

export default History;
