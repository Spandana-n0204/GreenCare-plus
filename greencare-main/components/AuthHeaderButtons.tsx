"use client";
import { useHospital } from "@/contexts/HospitalContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthHeaderButtons() {
  const { isAuthenticated, hospitalName, logout } = useHospital();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };
  
  if (!mounted) {
    return null; // Don't render anything during SSR
  }
  
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        <span className="hidden md:inline text-sm">Welcome, {hospitalName}</span>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    );
  }
  
  return (
    <Button asChild>
      <Link href="/auth/login">Login</Link>
    </Button>
  );
}