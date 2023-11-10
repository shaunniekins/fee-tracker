"use client";

import { useState, useEffect } from "react";
import Signin from "./Signin";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "../../../supabase";
import LoadingThreeDots from "@/components/LoadingDots/LoadingThreeDots";

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
  }, [pathname]);

  if (isLoading) {
    return <LoadingThreeDots />;
  }

  if (!user) {
    return <Signin />;
  }
}
