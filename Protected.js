import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useRouter } from "next/navigation";
import { ThreeDots, ProgressBar } from "react-loader-spinner";

const Protected = ({ children }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error && error.status === 401) {
          console.error("User is not authenticated.");
          router.push("/signin");
        } else if (error) {
          console.error("Error fetching user:", error.message);
        } else {
          setUser(data.user);
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    // You can show a loading spinner or message while checking authentication.
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </div>
    );
  }

  if (!user) {
    // Handle cases where the user is not authenticated.
    return null; // or a custom component for unauthenticated users
  }

  return <>{children}</>;
};

export default Protected;
