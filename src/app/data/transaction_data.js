import { supabase } from "../../../supabase";

export const fetchTransactionData = async (idNumber) => {
  try {
    let query = supabase.from("transaction_data").select("*");

    if (idNumber) {
      query = query.eq("id_num", idNumber);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching student data:", error);
      return { data: [], error };
    } else {
      //   console.log("Student data:", data);
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

    let query = supabase.from("transaction_data").select(
      `
      id_num,
      school_year,
      first_sem,
      first_sem_date,
      first_sem_time,
      second_sem,
      second_sem_time,
      second_sem_date,
      enrolled_students!inner (
        lastname,
        firstname,
        middlename,
        extname,
        stud_program,
        college
      ),
      date_last_modified
    `,
      { count: "exact" }
    );

    // console.log("id: ", id);
    // console.log("school_year: ", school_year);
    // console.log("college: ", college);

    if (id) {
      query = query.like("id_num", `%${id}%`);
    }
    if (school_year !== "") {
      query = query.eq("school_year", school_year);
    }
    if (college) {
      query = query.filter("enrolled_students.college", "eq", college);
    }

    const { data, error, count } = await query
      .order("date_last_modified", { ascending: false })
      .range(offset, offset + entriesPerPage - 1);

    if (error) {
      console.error("Error fetching student data:", error);
      return { data: [], error };
    } else {
      return { data, error: null, count };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: [], error };
  }
};

export const fetchTransactionDataForExport = async (valueLimit, start, end) => {
  try {
    let query = supabase.from("transaction_data").select(
      `
      id_num,
      school_year,
      first_sem,
      first_sem_date,
      first_sem_time,
      second_sem,
      second_sem_time,
      second_sem_date,
      enrolled_students!inner (
        lastname,
        firstname,
        middlename,
        extname,
        stud_program,
        college
      ),
      date_last_modified
    `,
      { count: "exact" }
    );

    if (start && end) {
      query = query.range(start, end);
    }
    if (valueLimit) {
      query = query.limit(valueLimit);
    }

    const { data, error, status, count } = await query;

    if (error) {
      console.error("Error fetching data:", error);
      return { data: [], error };
    } else {
      // console.log("server data", data);
      return { data, error: null, status, count };
    }
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
      console.error("Error fetching student data:", error);
      return { data: [], error };
    } else {
      // console.log("Student data:", data);
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
        enrolled_students!inner (
          lastname,
          firstname,
          middlename,
          extname,
          stud_program,
          college
        ),
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
      if (college) {
        query.filter("enrolled_students.college", "eq", college);
      }

      const { data, error, status, count } = await query;

      if (error) {
        console.error("Error fetching student data:", error);
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
      console.error("Error inserting student data:", error);
      return { data: null, error };
    } else {
      // console.log("Successfully inserted student data:", data);
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
      console.error("Error updating student data:", error);
      return { data: null, error };
    } else {
      // console.log("Successfully updated student data:", data);
      return { data, error: null };
    }
  } catch (error) {
    console.error("An error occurred:", error);
    return { data: null, error };
  }
};
