"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useRouter } from "next/navigation";
import LoadingThreeDots from "@/components/LoadingDots/LoadingThreeDots";

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
    <LoadingThreeDots />;
  }

  if (!user) {
    // Handle cases where the user is not authenticated.
    return null; // or a custom component for unauthenticated users
  }

  return <>{children}</>;
};

export default Protected;
