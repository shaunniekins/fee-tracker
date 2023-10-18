import { fetchTransactionDataForExport } from "../data/transaction_data";

export const handleExportToCSV = () => {
  const currentDate = new Date().toISOString().slice(0, 10);
  let dataVal, countVal;
  const fileName = `[${currentDate}] - LCO Fee Student List.csv`;
  const title = "LCO Fee Student List";

  const fetchData = async () => {
    const {
      data: data,
      error,
      status,
      count,
    } = await fetchTransactionDataForExport(1000, start, end);

    if (error) {
      // setError(error);
    } else {
      if (!dataVal || dataVal.length === 0) {
        dataVal = data;
      } else {
        dataVal = [...dataVal, ...data];
      }
      countVal = count;
    }
  };

  let isCalled = false;
  let breakCount = 0;
  let start = 0;
  let end = 999;

  const fetchDataAndLog = async () => {
    do {
      await fetchData(1000, start, end);
      start += 1000;
      end += 1000;
      if (!isCalled) {
        breakCount = countVal;
      } else {
        breakCount -= 1000;
      }
      isCalled = true;
    } while (breakCount > 1000);

    // Log dataVal after all asynchronous calls are complete
    // console.log("dataVa1l", dataVal);

    const csvData = [
      `"${title}"`,
      "ID Number,First Semester,First Semester Date Paid,Second Semester,Second Semester Date Paid,College,Program,Last Name,First Name,Middle Name,Ext Name",
    ];

    dataVal.forEach((enrolledStudent) => {
      const id_num = enrolledStudent.id_num;
      const first_sem = enrolledStudent.first_sem ? "paid" : "unpaid";
      const first_sem_date = enrolledStudent.first_sem_date;
      const second_sem = enrolledStudent.second_sem ? "paid" : "unpaid";
      const second_sem_date = enrolledStudent.second_sem_date;
      const college = enrolledStudent.enrolled_students.college;
      const stud_program = enrolledStudent.enrolled_students.stud_program;
      const lastname = enrolledStudent.enrolled_students.lastname;
      const firstname = enrolledStudent.enrolled_students.firstname;
      const middlename = enrolledStudent.enrolled_students.middlename;
      const extname = enrolledStudent.enrolled_students.extname;

      const row = [
        `"${id_num}"`,
        `"${first_sem}"`,
        `"${first_sem_date}"`,
        `"${second_sem}"`,
        `"${second_sem_date}"`,
        `"${college}"`,
        `"${stud_program}"`,
        `"${lastname}"`,
        `"${firstname}"`,
        `"${middlename}"`,
        `"${extname}"`,
      ].join(",");

      csvData.push(row);
    });

    const csvContent = csvData.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    const response = confirm("Do you want to download the CSV file?");
    if (response) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  fetchDataAndLog();
};
