"use client";

import { useState, useEffect } from "react";
import Signin from "../../components/Signin/Signin";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../../supabase";
import { ThreeDots } from "react-loader-spinner";

export default function SigninRoute() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error && error.status === 401) {
          console.error("User is not authenticated.");
        } else if (error) {
          console.error("Error fetching user:", error.message);
        } else if (data && pathname === "/signin") {
          // User is already logged in and is on the '/signin' route, redirect to '/dashboard'
          setUser(data.user);
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("An unexpected error occurred:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [pathname]); // Include pathname in the dependency array

  if (isLoading) {
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
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center font-Montserrat bg-[#357112] gap-y-10">
        <div className="flex flex-col items-center top-0 absolute mt-5">
          <img
            className="w-20 h-20 md:w-32 md:h-32"
            src="lco-logo-enhanced.svg"
            alt="LCO Logo"
          />
          <h2 className="text-white font-[600]">LCO Fee Tracker</h2>
        </div>
        <div className="w-full flex justify-center px-5">
          <Signin />
        </div>
        <h3 className="text-white text-xs bottom-0 absolute mb-5">
          Est. 2023-2024
        </h3>
      </div>
    );
  }
}
