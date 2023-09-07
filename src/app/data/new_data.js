import { supabase } from "../../../supabase";

export const fetchStudentData = async () => {
  try {
    const { data, error } = await supabase.from("student_data").select("*");

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

export const insertStudentData = async (rowData) => {
  try {
    const { data, error } = await supabase
      .from("student_data")
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

export const updateStudentData = async (idNum, schoolYear, updateData) => {
  try {
    const { data, error } = await supabase
      .from("student_data")
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
