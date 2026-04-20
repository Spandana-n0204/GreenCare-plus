"use client"

import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddRecordForm } from "@/components/AddRecordForm"

import { Plus, FileText, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Drug {
  name: string;
  dosage: string;
  sustainabilityRating?: number;
  carbonFootprint?: number;
}

interface MedicalRecord {
  _id: string;
  mrNo: string;
  date: string;
  patient: {
    name: string;
    mrNo: string;
  };
  diagnoses: string[];
  drugs: Drug[];
  reference?: string;
  doctor: {
    name: string;
    _id: string;
  };
  status: string;
}

export default function RecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const response = await fetch('/api/records');
      const data = await response.json();
      setRecords(data);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDrugs = (drugs: Drug[]) => {
    return drugs.map(drug => `${drug.name} (${drug.dosage})`).join(', ');
  };

  return (
    <div className="mx-auto py-8">
      <Card>
      <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Medical Records</CardTitle>
              <CardDescription>View and manage patient medical records</CardDescription>
            </div>
            <AddRecordForm onSuccess={fetchRecords} />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Patient</TableHead>
                  <TableHead>MR No.</TableHead>
                  <TableHead>Diagnoses</TableHead>
                  <TableHead>Drugs</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell className="font-medium">
                      {format(new Date(record.date), 'PPP')}
                    </TableCell>
                    <TableCell>{record.patient.name}</TableCell>
                    <TableCell>{record.mrNo}</TableCell>
                    <TableCell>{record.diagnoses.join(', ')}</TableCell>
                    <TableCell>
                      {record.drugs.length > 0 ? formatDrugs(record.drugs) : 'None'}
                    </TableCell>
                    <TableCell>Dr. {record.doctor.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        record.status === 'Completed' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>View details</DropdownMenuItem>
                            <DropdownMenuItem>Edit record</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Print record</DropdownMenuItem>
                            <DropdownMenuItem>Export as PDF</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Archive record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}