"use client"

import { useHospital } from "@/contexts/HospitalContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Hospital } from "lucide-react";

export function HospitalSelector() {
  const { hospitalId, setHospitalId } = useHospital();
  const hospitals = [
    { id: "hosp1", name: "Main Hospital" },
    { id: "hosp2", name: "North Campus" },
    { id: "hosp3", name: "Children's Wing" },
  ];

  const currentHospital = hospitals.find(h => h.id === hospitalId) || hospitals[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Hospital className="h-4 w-4" />
          {currentHospital.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {hospitals.map((hospital) => (
          <DropdownMenuItem
            key={hospital.id}
            onClick={() => setHospitalId(hospital.id)}
          >
            {hospital.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}