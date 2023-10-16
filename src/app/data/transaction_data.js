import { supabase } from "../../../supabase";

export const fetchTransactionData = async () => {
  try {
    const { data, error } = await supabase.from("transaction_data").select("*");

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

export const fetchTransactionWithStudentData = async () => {
  try {
    const { data, error } = await supabase.from("transaction_data").select(`
    id_num,
    school_year,
    first_sem,
    first_sem_date,
    first_sem_time,
    second_sem,
    second_sem_time,
    second_sem_date,
    enrolled_students (
      lastname,
      firstname,
      middlename,
      extname,
      stud_program,
      college
    )
  `);

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
