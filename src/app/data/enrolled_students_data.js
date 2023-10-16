import { supabase } from "../../../supabase";

export const fetchEnrolledStudentsData = async () => {
  try {
    const { data, error } = await supabase
      .from("enrolled_students")
      .select("*");

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
