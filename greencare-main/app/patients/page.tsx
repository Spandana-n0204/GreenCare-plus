import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientTable } from "@/components/patients/PatientTable";
import { QrCodeIcon, Plus, Download } from "lucide-react";
import { PatientRegistrationForm } from "@/components/patients/PatientRegistrationForm";

export default function PatientsPage() {
  return (
    <DashboardShell>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Quick Registration</h2>
        <PatientRegistrationForm />
      </div>
      <DashboardHeader heading="Patient Management" text="Register and manage patients in a paperless environment">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </DashboardHeader>
      
      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Patients</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="waiting">Waiting</TabsTrigger>
          </TabsList>
          <Button variant="outline" size="sm">
            <QrCodeIcon className="mr-2 h-4 w-4" />
            QR Check-in
          </Button>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          <PatientTable />
        </TabsContent>
        
        <TabsContent value="active" className="space-y-4">
          <PatientTable />
        </TabsContent>
        
        <TabsContent value="recent" className="space-y-4">
          <PatientTable />
        </TabsContent>
        
        <TabsContent value="waiting" className="space-y-4">
          <PatientTable />
        </TabsContent>
      </Tabs>
      
    </DashboardShell>
  );
}