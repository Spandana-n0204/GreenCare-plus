"use client"

import { useHospital } from "@/contexts/HospitalContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import MetricsEditor from "@/components/MetricsEditor";
import MonthlyDataEditor from "@/components/MonthlyDataEditor";
import DepartmentsEditor from "@/components/DepartmentsEditor";
import GoalsEditor from "@/components/GoalsEditor";
import InitiativesEditor from "@/components/InitiativesEditor";
export default function SustainabilityAdminPage() {
  const { hospitalId } = useHospital();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sustainability Management</h1>
        <div className="text-sm text-muted-foreground">
          Hospital ID: {hospitalId}
        </div>
      </div>

      <Tabs defaultValue="metrics">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Data</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="initiatives">Initiatives</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <MetricsEditor hospitalId={hospitalId} />
        </TabsContent>

        <TabsContent value="monthly">
          <MonthlyDataEditor hospitalId={hospitalId} />
        </TabsContent>

        <TabsContent value="departments">
          <DepartmentsEditor hospitalId={hospitalId} />
        </TabsContent>

        <TabsContent value="goals">
          <GoalsEditor hospitalId={hospitalId} />
        </TabsContent>

        <TabsContent value="initiatives">
          <InitiativesEditor hospitalId={hospitalId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}