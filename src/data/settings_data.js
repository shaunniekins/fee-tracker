import { supabase } from "../../supabase";

export const fetchSettingsData = async () => {
  try {
    const { data, error } = await supabase.from("settings").select("*");

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

export const updateSettingsData = async (id, updateData) => {
  try {
    const { data, error } = await supabase
      .from("settings")
      .update(updateData)
      .eq("id", id)
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
