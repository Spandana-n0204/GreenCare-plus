"use client"

import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QrCode, Plus, Clock } from "lucide-react";
import { PatientRegistrationForm } from "@/components/patients/PatientRegistrationForm";

interface Registration {
  _id: string;
  mrNo: string;
  name: string;
  registrationDate: string;
  qrCode: string;
  waitingTime: number;
  status: string;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const hospitalId = localStorage.getItem('hospitalId');
      const response = await fetch('/api/registrations',{
        method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hospital-ID': hospitalId || '', 
      },
      });
      const data = await response.json();
      setRegistrations(data);
    } catch (error) {
      console.error('Failed to fetch registrations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegistration = async (formData: any) => {
    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        fetchRegistrations(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to create registration:', error);
    }
  };

  return (
    <div className="  mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patient Registrations</CardTitle>
              <CardDescription>Manage patient check-ins and registrations</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <QrCode className="mr-2 h-4 w-4" />
                QR Check-in
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Registration
              </Button>
            </div>
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
                  <TableHead>MR Number</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Registration Time</TableHead>
                  <TableHead>Waiting Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>QR Code</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((registration) => (
                  <TableRow key={registration._id}>
                    <TableCell className="font-medium">{registration.mrNo}</TableCell>
                    <TableCell>{registration.name}</TableCell>
                    <TableCell>{format(new Date(registration.registrationDate), 'PPp')}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                        {registration.waitingTime} mins
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        registration.status === 'Completed' 
                          ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }>
                        {registration.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <QrCode className="mr-2 h-4 w-4" />
                        View QR
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Registration</CardTitle>
          <CardDescription>Register a new patient with our paperless system</CardDescription>
        </CardHeader>
        <CardContent>
          <PatientRegistrationForm />
        </CardContent>
      </Card>
    </div>
  );
}