import { supabase } from "../../../supabase";

export const fetchEnrolledStudentsData = async (idNumbers, college) => {
  try {
    let query = supabase.from("enrolled_students").select("*");

    if (idNumbers) {
      query = query.in("idnumber", idNumbers);
    }
    if (college) {
      query = query.eq("college", college);
    }

    const { data, error } = await query;

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

export const fetchEnrolledStudentsCollegeData = async () => {
  try {
    const { data, error } = await supabase.from("distinct_college").select();

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

export const insertEnrolledStudentData = async (rowData) => {
  try {
    const { data, error } = await supabase
      .from("enrolled_students")
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
