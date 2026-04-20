"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Leaf, TrendingUp, FileText, Recycle } from "lucide-react";

interface SustainabilityMetricsProps {
  data: {
    paperSaved: number;
    digitalAdoption: number;
    carbonReduction: number;
  };
}

export function SustainabilityMetrics({ data }: SustainabilityMetricsProps) {
  return (
    <div className="mx-auto py-8 space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paper Saved Today</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(data.paperSaved / 365).toLocaleString()} sheets</div>
            <p className="text-xs text-muted-foreground">
              Equivalent to {(data.paperSaved / 365 / 8333).toFixed(2)} trees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digital Transactions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.digitalAdoption}%</div>
            <p className="text-xs text-muted-foreground">
              Today&apos;s paperless operations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trees Preserved</CardTitle>
            <Leaf className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(data.paperSaved / 8333)}</div>
            <p className="text-xs text-muted-foreground">
              Total trees saved through digitization
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Offset</CardTitle>
            <Recycle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(data.carbonReduction * 1000)} kg</div>
            <p className="text-xs text-muted-foreground">
              CO₂ emissions prevented
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Environmental Impact Progress</CardTitle>
          <CardDescription>Tracking our sustainability goals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Paper Reduction Goal</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600">
                    On Track
                  </Badge>
                </div>
                <span className="text-sm font-medium">
                  {((data.paperSaved / 100000) * 100).toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={(data.paperSaved / 100000) * 100} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {data.paperSaved.toLocaleString()} of 100,000 sheets target
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Digital Adoption</span>
                  <Badge variant="outline" className="bg-blue-500/10 text-blue-600">
                    Exceeding
                  </Badge>
                </div>
                <span className="text-sm font-medium">
                  {data.digitalAdoption}%
                </span>
              </div>
              <Progress 
                value={data.digitalAdoption} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                Target: 90% digital adoption
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Carbon Reduction</span>
                  <Badge className="bg-amber-500/10 text-amber-600">
                    In Progress
                  </Badge>
                </div>
                <span className="text-sm font-medium">
                  {data.carbonReduction}%
                </span>
              </div>
              <Progress 
                value={data.carbonReduction} 
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                Target: 40% carbon reduction
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}