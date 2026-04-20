"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, MoreHorizontal, Search, Loader2 } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

interface Patient {
  _id: string;
  mrNo: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  notes?: string;
  registrations: string[];
  status: string;
  createdAt: string;
}

export function PatientTable() {
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // Fetch patients on component mount
  React.useEffect(() => {
    async function fetchPatients() {
      try {
        setIsLoading(true)
        // Get hospitalId from localStorage
        const hospitalId = localStorage.getItem('hospitalId') || 'demo-hospital'
        
        const response = await fetch('/api/patients', {
          headers: {
            'X-Hospital-ID': hospitalId,
          },
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to fetch patients')
        }
        
        const data = await response.json()
        setPatients(data)
      } catch (err) {
        console.error(err)
        setError(err instanceof Error ? err.message : 'Failed to fetch patients')
        toast.error("Error")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPatients()
  }, [])
  function formatDate(dateString: string) {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.mrNo.toLowerCase().includes(searchQuery.toLowerCase())
  )

  function getStatusColor(status: string) {
    switch (status) {
      case "Active":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10"
      case "Waiting":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
      case "With Doctor":
        return "bg-violet-500/10 text-violet-600 dark:text-violet-400 hover:bg-violet-500/10"
      case "Completed":
        return "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/10"
      default:
        return ""
    }
  }

  // Handle view patient details
  function handleViewPatient(mrNo: string) {
    // Navigate to patient details page
    window.location.href = `/patients/${mrNo}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Patients</h2>
        <div className="relative max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search patients..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-destructive">Error: {error}</p>
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MR#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Registration Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    {searchQuery ? "No patients match your search." : "No patients found."}
                  </TableCell>
                </TableRow>
              ) : (
                filteredPatients.map((patient) => (
                  <TableRow key={patient._id}>
                    <TableCell>{patient.mrNo}</TableCell>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{patient.gender}</TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{formatDate(patient.createdAt)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(patient.status)} variant="outline">
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleViewPatient(patient.mrNo)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Register Visit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Edit Patient
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}