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
    if (college) {
      query = query.filter("enrolled_students.college", "eq", college);
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
