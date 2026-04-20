"use client"

import { Leaf, Users, FilePlus, Calendar, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { PatientFlow } from "@/components/dashboard/PatientFlow";
import { AppointmentsChart } from "@/components/dashboard/AppointmentsChart";
import { SustainabilityMetrics } from "@/components/dashboard/SustainabilityMetrics";
import { DoctorWellbeingChart } from "@/components/dashboard/DoctorWellbeingChart";
import { useEffect, useState } from 'react';

interface DashboardData {
  stats: {
    totalPatients: number;
    newRegistrations: number;
    appointmentsToday: number;
    avgWaitTime: number;
    waitTimeChange: number;
    registrationChange: number;
  };
  patientFlow: Array<{
    hour: number;
    count: number;
  }>;
  appointments: Array<{
    department: string;
    count: number;
  }>;
  sustainability: {
    paperSaved: number;
    carbonReduction: number;
    digitalAdoption: number;
  };
  wellbeing: Array<{
    doctor: string;
    workload: number;
    stress: number;
  }>;
  paperUsage: Array<{
    category: string;
    percentage: number;
  }>;
  digitalAdoption: Array<{
    category: string;
    percentage: number;
  }>;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardShell>
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    );
  }

  if (!data) {
    return (
      <DashboardShell>
        <div className="text-center py-8">
          Failed to load dashboard data
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Overview of hospital operations and sustainability metrics">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Last updated: Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </DashboardHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardStats 
          title="Total Patients"
          value={data.stats.totalPatients.toLocaleString()}
          description={`${data.stats.registrationChange > 0 ? '+' : ''}${data.stats.registrationChange}% from last month`}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardStats 
          title="New Registrations"
          value={data.stats.newRegistrations.toString()}
          description="Today"
          icon={<FilePlus className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardStats 
          title="Appointments"
          value={data.stats.appointmentsToday.toString()}
          description="Scheduled for today"
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <DashboardStats 
          title="Average Wait Time"
          value={`${data.stats.avgWaitTime} min`}
          description={`${data.stats.waitTimeChange > 0 ? '+' : ''}${data.stats.waitTimeChange}% from last week`}
          icon={<Activity className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Patient Flow</CardTitle>
            <CardDescription>
              Real-time patient flow and department utilization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PatientFlow data={data.patientFlow} />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Appointments</CardTitle>
            <CardDescription>
              Distribution by department
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentsChart data={data.appointments} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sustainability Metrics</CardTitle>
              <CardDescription>Environmental impact tracking</CardDescription>
            </div>
            <Leaf className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <SustainabilityMetrics data={data.sustainability} />
          </CardContent>
        </Card>
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Doctor Wellbeing</CardTitle>
            <CardDescription>
              Monitoring workload and stress indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DoctorWellbeingChart data={data.wellbeing} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Paper Usage Reduction</CardTitle>
              <CardDescription>YTD statistics</CardDescription>
            </div>
            <TrendingUp className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Paper Saved</span>
                <span className="text-sm font-medium">{data.sustainability.paperSaved.toLocaleString()} sheets</span>
              </div>
              {data.paperUsage.map((usage) => (
                <div key={usage.category} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>{usage.category}</span>
                    <span>{usage.percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${usage.percentage}%`,
                        backgroundColor: `hsl(var(--chart-${['1','2','3'][data.paperUsage.indexOf(usage)]}))`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="pt-2">
                <p className="text-xs text-muted-foreground">
                  Equivalent to saving approximately {Math.round(data.sustainability.paperSaved / 8333)} trees
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Carbon Footprint</CardTitle>
            <CardDescription>Impact reduction tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-2">
              <div className="relative h-52 w-52">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold">-{data.sustainability.carbonReduction}%</span>
                    <p className="text-xs text-muted-foreground">From baseline</p>
                  </div>
                </div>
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <circle
                    className="stroke-muted fill-none"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="10"
                  />
                  <circle
                    className="stroke-chart-2 fill-none animate-[dash_1.5s_ease-in-out]"
                    cx="50"
                    cy="50"
                    r="40"
                    strokeWidth="10"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - (data.sustainability.carbonReduction / 100))}
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className="text-center">
                <p className="text-sm">Total CO₂ Reduction</p>
                <p className="text-lg font-semibold">{Math.round(data.sustainability.carbonReduction * 1000)} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Digital Adoption</CardTitle>
            <CardDescription>Paperless transition progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.digitalAdoption.map((adoption) => (
                <div key={adoption.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{adoption.category}</span>
                    <span className="text-sm font-medium">{adoption.percentage}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-secondary">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${adoption.percentage}%`,
                        backgroundColor: `hsl(var(--chart-${['1','2','3','4'][data.digitalAdoption.indexOf(adoption)]}))`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}