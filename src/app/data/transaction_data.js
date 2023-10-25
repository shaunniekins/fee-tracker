import { supabase } from "../../../supabase";

export const fetchTransactionData = async (idNumber) => {
  try {
    let query = supabase.from("transaction_data").select("*");

    if (idNumber) {
      query = query.eq("id_num", idNumber);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching data:", error);
      return { data: [], error };
    } else {
      //   console.log("Data:", data);
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: [], error };
  }
};

export const fetchTransactionWithStudentData = async (
  entriesPerPage,
  currentPage,
  id,
  school_year,
  college
) => {
  try {
    const offset = (currentPage - 1) * entriesPerPage;

    // Fetch transaction data
    let transactionQuery = supabase.from("transaction_data").select(
      `
        id_num,
        school_year,
        first_sem,
        first_sem_date,
        first_sem_time,
        second_sem,
        second_sem_time,
        second_sem_date,
        date_last_modified
      `,
      { count: "exact" }
    );

    if (id) {
      transactionQuery = transactionQuery.like("id_num", `%${id}%`);
    }
    if (school_year !== "") {
      transactionQuery = transactionQuery.eq("school_year", school_year);
    }
    if (college) {
      transactionQuery = transactionQuery.eq("college", college);
    }

    const { data: transactionData, error: transactionError } =
      await transactionQuery
        .order("date_last_modified", { ascending: false })
        .range(offset, offset + entriesPerPage - 1);

    if (transactionError) {
      console.error("Error fetching transaction data:", transactionError);
      return { data: [], error: transactionError };
    }

    // Extract the idnumbers from transaction data
    const idNumbers = transactionData.map((item) => item.id_num);

    // Fetch student data matching the extracted idnumbers
    let studentQuery = supabase.from("enrolled_students").select("*");

    if (idNumbers.length > 0) {
      studentQuery = studentQuery.in("idnumber", idNumbers);
    }

    const { data: studentData, error: studentError } = await studentQuery;

    if (studentError) {
      console.error("Error fetching student data:", studentError);
      return { data: [], error: studentError };
    }

    // Merge the data from both queries based on the common key (id_num and idnumber)
    const mergedData = transactionData.map((transaction) => {
      const matchingStudent = studentData.find(
        (student) => student.idnumber === transaction.id_num
      );
      return { ...transaction, ...matchingStudent };
    });

    return { data: mergedData, error: null };
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: [], error };
  }
};

export const fetchTransactionDataForExport = async (valueLimit, start, end) => {
  try {
    let transactionQuery = supabase.from("transaction_data").select(
      `
      id_num,
      school_year,
      first_sem,
      first_sem_date,
      first_sem_time,
      second_sem,
      second_sem_time,
      second_sem_date,
      date_last_modified
    `,
      { count: "exact" }
    );

    if (start && end) {
      transactionQuery = transactionQuery.range(start, end);
    }
    if (valueLimit) {
      transactionQuery = transactionQuery.limit(valueLimit);
    }

    const {
      data: transactionData,
      error: transactionError,
      status,
      count,
    } = await transactionQuery.order("date_last_modified", {
      ascending: false,
    });

    if (transactionError) {
      console.error("Error fetching transaction data:", transactionError);
      return { data: [], error: transactionError };
    }

    // Extract the idnumbers from transaction data
    const idNumbers = transactionData.map((item) => item.id_num);

    // Fetch student data matching the extracted idnumbers
    let studentQuery = supabase.from("enrolled_students").select("*");

    if (idNumbers.length > 0) {
      studentQuery = studentQuery.in("idnumber", idNumbers);
    }

    const { data: studentData, error: studentError } = await studentQuery;

    if (studentError) {
      console.error("Error fetching student data:", studentError);
      return { data: [], error: studentError };
    }

    // Merge the data from both queries based on the common key (id_num and idnumber)
    const mergedData = transactionData.map((transaction) => {
      const matchingStudent = studentData.find(
        (student) => student.idnumber === transaction.id_num
      );
      return { ...transaction, ...matchingStudent };
    });

    return { data: mergedData, error: null };
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: [], error };
  }
};

export const fetchTransactionSchoolYearData = async () => {
  try {
    const { data, error } = await supabase
      .from("distinct_school_year")
      .select();

    if (error) {
      console.error("Error fetching data:", error);
      return { data: [], error };
    } else {
      // console.log("Data:", data);
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: [], error };
  }
};

export const fetchTransactionCountTotalData = async (
  id,
  school_year,
  college
) => {
  let totalCount = 0;
  let firstSemesterData = [];
  let secondSemesterData = [];

  try {
    const fetchCount = async (semesterCondition) => {
      const query = supabase
        .from("transaction_data")
        .select(
          `
        id_num,
        school_year,
        first_sem,
        first_sem_date,
        first_sem_time,
        second_sem,
        second_sem_time,
        second_sem_date,
      
        date_last_modified
      `,
          { count: "exact", head: true }
        )
        .match(semesterCondition);

      if (id) {
        query.like("id_num", `%${id}%`);
      }
      if (school_year !== "") {
        query.eq("school_year", school_year);
      }
      // if (college) {
      //   query.filter("enrolled_students.college", "eq", college);
      // }

      const { data, error, status, count } = await query;

      if (error) {
        console.error("Error fetching student data:2", error);
        return { data: [], error };
      } else {
        totalCount += count;
        return { data, error: null, status, count };
      }
    };

    const firstSemesterResult = await fetchCount({ first_sem: true });
    const secondSemesterResult = await fetchCount({ second_sem: true });

    if (firstSemesterResult.error || secondSemesterResult.error) {
      return { data: [], error: "Error fetching data" };
    }

    if (Array.isArray(firstSemesterResult.data)) {
      firstSemesterData = firstSemesterResult.data;
    }

    if (Array.isArray(secondSemesterResult.data)) {
      secondSemesterData = secondSemesterResult.data;
    }

    return {
      data: [...firstSemesterData, ...secondSemesterData],
      error: null,
      status: firstSemesterResult.status,
      count: totalCount,
    };
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: [], error };
  }
};

export const insertTransactionData = async (rowData) => {
  try {
    const { data, error } = await supabase
      .from("transaction_data")
      .insert([rowData])
      .select("*");

    if (error) {
      console.error("Error inserting data:", error);
      return { data: null, error };
    } else {
      // console.log("Successfully inserted data:", data);
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: null, error };
  }
};

export const updateTransactionData = async (idNum, schoolYear, updateData) => {
  try {
    const { data, error } = await supabase
      .from("transaction_data")
      .update(updateData)
      .eq("id_num", idNum)
      .eq("school_year", schoolYear)
      .select("*");

    if (error) {
      console.error("Error updating data:", error);
      return { data: null, error };
    } else {
      // console.log("Successfully updated data:", data);
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: null, error };
  }
};
