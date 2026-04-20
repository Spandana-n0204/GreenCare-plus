"use client"

import React, { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, TrendingUp, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface SustainabilityData {
  metrics: {
    paperSaved: number;
    carbonReduction: number;
    digitalAdoption: number;
    energyEfficiency: number;
  };
  monthlyData: Array<{
    name: string;
    Paper: number;
    Carbon: number;
    Energy: number;
  }>;
  departmentalData: Array<{
    name: string;
    value: number;
  }>;
  goals: Array<{
    name: string;
    achieved: number;
    goal: number;
    percentage: number;
    unit: string;
  }>;
  initiatives: Array<{
    name: string;
    completed: boolean;
    impact: string;
  }>;
}

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function SustainabilityPage() {
  const [data, setData] = useState<SustainabilityData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch('/api/sustainability');
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (isMounted) {
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch sustainability data:', error);
        if (isMounted) {
          setError(error instanceof Error ? error.message : 'Failed to fetch data');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchData();
    
    // Cleanup function to prevent state updates if the component unmounts
    return () => {
      isMounted = false;
    };
  }, []);

  // Loading state UI
  if (isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Sustainability Dashboard"
          text="Track and monitor environmental impact metrics"
        />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardShell>
    );
  }

  // Error state UI
  if (error || !data) {
    return (
      <DashboardShell>
        <DashboardHeader
          heading="Sustainability Dashboard"
          text="Track and monitor environmental impact metrics"
        />
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || 'Failed to load sustainability data. Please try again later.'}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center mt-6">
          <Button onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Sustainability Dashboard"
        text="Track and monitor environmental impact metrics"
      >
        
        <div className="flex items-center gap-2">
        <Link href="/sustainability/dashboard" passHref>
          <Button className="hidden md:inline-flex">
            Manage Initiatives
          </Button>
        </Link>
          <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400">
            <Leaf className="mr-1 h-3 w-3" />
            SDG 3 Aligned
          </Badge>
        </div>
      </DashboardHeader>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paper Saved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.paperSaved.toLocaleString()} sheets</div>
            <p className="text-xs text-muted-foreground">{Math.round(data.metrics.paperSaved/2)} trees preserved</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Reduction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.carbonReduction} tons CO₂e</div>
            <p className="text-xs text-muted-foreground">Equivalent to planting {Math.round(data.metrics.carbonReduction * 16.6)} trees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digital Adoption</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.digitalAdoption}%</div>
            <p className="text-xs text-muted-foreground">Across all hospital processes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Energy Efficiency</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.metrics.energyEfficiency}% reduction</div>
            <p className="text-xs text-muted-foreground">Compared to last year</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="charts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="charts">Charts & Metrics</TabsTrigger>
          <TabsTrigger value="goals">Sustainability Goals</TabsTrigger>
          <TabsTrigger value="initiatives">Green Initiatives</TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Monthly Progress</CardTitle>
                <CardDescription>Annual sustainability metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={data.monthlyData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px' 
                        }} 
                      />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="Paper" stroke="hsl(var(--chart-1))" activeDot={{ r: 8 }} name="Paper Saved (sheets x100)" />
                      <Line yAxisId="right" type="monotone" dataKey="Carbon" stroke="hsl(var(--chart-2))" name="Carbon Reduction (tons)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Paper Reduction by Department</CardTitle>
                <CardDescription>Distribution of paper-saving impact</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.departmentalData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {data.departmentalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          borderColor: 'hsl(var(--border))',
                          borderRadius: '8px' 
                        }} 
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Energy Consumption</CardTitle>
              <CardDescription>Monthly energy usage in kWh</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={data.monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        borderColor: 'hsl(var(--border))',
                        borderRadius: '8px' 
                      }} 
                    />
                    <Legend />
                    <Bar dataKey="Energy" fill="hsl(var(--chart-3))" name="Energy Usage (kWh)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>2025 Sustainability Goals</CardTitle>
              <CardDescription>Progress towards annual targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {data.goals.map((goal) => (
                  <div key={goal.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{goal.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {goal.achieved} / {goal.goal} {goal.unit}
                        </p>
                      </div>
                      <span className="text-sm font-medium">{goal.percentage}%</span>
                    </div>
                    <Progress value={goal.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
          <Card>
              <CardHeader>
                <CardTitle>Carbon Reduction Target</CardTitle>
                <CardDescription>40 tons CO₂e by end of year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative h-52 w-52">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold">82%</span>
                        <p className="text-xs text-muted-foreground">of target achieved</p>
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
                        strokeDashoffset={2 * Math.PI * 40 * (1 - 0.82)}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Achieved 32.8 tons CO₂e reduction
                    </p>
                    <p className="text-sm text-muted-foreground">
                      7.2 tons remaining to reach target
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Paper Reduction Target</CardTitle>
                <CardDescription>60,000 sheets by end of year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative h-52 w-52">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-3xl font-bold">91%</span>
                        <p className="text-xs text-muted-foreground">of target achieved</p>
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
                        className="stroke-chart-1 fill-none animate-[dash_1.5s_ease-in-out]"
                        cx="50"
                        cy="50"
                        r="40"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - 0.91)}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Saved 54,892 sheets of paper
                    </p>
                    <p className="text-sm text-muted-foreground">
                      5,108 sheets remaining to reach target
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="initiatives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Green Initiatives</CardTitle>
              <CardDescription>Ongoing and completed sustainability projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {data.initiatives.map((initiative) => (
                  <div key={initiative.name} className="flex items-start space-x-4">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${initiative.completed ? 'bg-green-500/20' : 'bg-amber-500/20'}`}>
                      {initiative.completed ? (
                        <Check className={`h-4 w-4 text-green-600 dark:text-green-400`} />
                      ) : (
                        <div className="h-2 w-2 rounded-full bg-amber-600 dark:bg-amber-400"></div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium">{initiative.name}</h3>
                        <Badge variant="outline" className={initiative.completed ? 
                          'bg-green-500/10 text-green-600 dark:text-green-400' : 
                          'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        }>
                          {initiative.completed ? 'Completed' : 'In Progress'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{initiative.impact}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sustainable Development Goals Alignment</CardTitle>
              <CardDescription>How our initiatives support SDG 3 and other global goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium">SDG 3: Good Health and Well-being</h3>
                  <p className="text-sm text-muted-foreground">
                    Our digital systems improve healthcare access and quality while reducing environmental impact
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Improved patient outcomes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Reduced waiting times</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Enhanced doctor wellbeing</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">SDG 12: Responsible Consumption</h3>
                  <p className="text-sm text-muted-foreground">
                    Our paperless systems and sustainable procurement practices reduce waste
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Reduced paper consumption</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Eco-friendly medication options</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Sustainable supply chain</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">SDG 13: Climate Action</h3>
                  <p className="text-sm text-muted-foreground">
                    Our energy efficiency measures and carbon reduction initiatives combat climate change
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Carbon footprint reduction</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Energy efficiency improvements</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Renewable energy transition</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">SDG 17: Partnerships for the Goals</h3>
                  <p className="text-sm text-muted-foreground">
                    We collaborate with stakeholders to maximize our sustainable impact
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Industry partnerships</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Knowledge sharing</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm">Global health initiatives</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  );
}