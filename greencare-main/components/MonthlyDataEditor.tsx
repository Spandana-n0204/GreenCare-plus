"use client"

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface MonthlyDataItem {
  _id?: string;
  month: string;
  paperSaved: number;
  carbonReduction: number;
  energyUsage: number;
}

export default function MonthlyDataEditor({ hospitalId }: { hospitalId: string | null}) {
    const [monthlyData, setMonthlyData] = useState<MonthlyDataItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        if (!hospitalId) {
          setError("No hospital ID provided");
          setLoading(false);
          return;
        }
        
        try {
          setLoading(true);
          const res = await fetch(`/api/sustainability/monthly?hospitalId=${hospitalId}`);
          
          if (!res.ok) {
            throw new Error(`Failed to fetch monthly data: ${res.status}`);
          }
          
          const data = await res.json();
          setMonthlyData(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load monthly data");
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }, [hospitalId]);
  
    const handleAddMonth = () => {
      setMonthlyData([
        ...monthlyData,
        {
          month: "",
          paperSaved: 0,
          carbonReduction: 0,
          energyUsage: 0,
        },
      ]);
    };
  
    const handleSave = async () => {
      if (!hospitalId) {
        setError("No hospital ID provided. Cannot save data.");
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        const res = await fetch(`/api/sustainability/monthly`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: monthlyData, hospitalId }),
        });
        
        if (!res.ok) {
          throw new Error(`Failed to save monthly data: ${res.status}`);
        }
        
        const result = await res.json();
        
        if (result.success) {
          setSuccess(true);
        } else {
          throw new Error("Server returned unsuccessful response");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save monthly data");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Monthly Sustainability Data</CardTitle>
            <div className="space-x-2">
              <Button variant="outline" onClick={handleAddMonth} disabled={loading}>
                Add Month
              </Button>
              <Button onClick={handleSave} disabled={loading || !hospitalId}>
                {loading ? "Saving..." : "Save All"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-500">
              <AlertDescription>Monthly data saved successfully!</AlertDescription>
            </Alert>
          )}
          
          {loading && !monthlyData.length ? (
            <div className="py-4 text-center text-gray-500">Loading monthly data...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Paper Saved</TableHead>
                  <TableHead>Carbon Reduction</TableHead>
                  <TableHead>Energy Usage</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      No monthly data available. Click &quot;Add Month&quot; to create a new entry.
                    </TableCell>
                  </TableRow>
                ) : (
                  monthlyData.map((month, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={month.month}
                          onChange={(e) => {
                            const newData = [...monthlyData];
                            newData[index].month = e.target.value;
                            setMonthlyData(newData);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={month.paperSaved}
                          onChange={(e) => {
                            const newData = [...monthlyData];
                            newData[index].paperSaved = Number(e.target.value);
                            setMonthlyData(newData);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.1"
                          value={month.carbonReduction}
                          onChange={(e) => {
                            const newData = [...monthlyData];
                            newData[index].carbonReduction = Number(e.target.value);
                            setMonthlyData(newData);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={month.energyUsage}
                          onChange={(e) => {
                            const newData = [...monthlyData];
                            newData[index].energyUsage = Number(e.target.value);
                            setMonthlyData(newData);
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            setMonthlyData(monthlyData.filter((_, i) => i !== index));
                          }}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    );
  }