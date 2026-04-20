"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useHospital } from "@/contexts/HospitalContext";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useHospital();
  const router = useRouter();
  
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);
  
  if (!isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Please log in to access this page...</p>
      </div>
    );
  }
  
  return <>{children}</>;
}