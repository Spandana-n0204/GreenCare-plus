"use client"

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface GoalData {
  _id?: string;
  name: string;
  target: number;
  unit: string;
  currentValue?: number;
}

export default function GoalsEditor({ hospitalId }: { hospitalId: string | null}) {
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      if (!hospitalId) {
        setError("No hospital ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const res = await fetch(`/api/sustainability/goals?hospitalId=${hospitalId}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch goals: ${res.status}`);
        }
        
        const data = await res.json();
        setGoals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load goals");
      } finally {
        setLoading(false);
      }
    };
    
    fetchGoals();
  }, [hospitalId]);

  const handleAddGoal = () => {
    setGoals([...goals, { name: "", target: 0, unit: "" }]);
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
      
      const res = await fetch('/api/sustainability/goals', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: goals, hospitalId }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to save goals: ${res.status}`);
      }
      
      const result = await res.json();
      
      if (result.success) {
        setSuccess(true);
      } else {
        throw new Error("Server returned unsuccessful response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save goals");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Sustainability Goals</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleAddGoal} disabled={loading}>
              Add Goal
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
            <AlertDescription>Goals saved successfully!</AlertDescription>
          </Alert>
        )}
        
        {loading && !goals.length ? (
          <div className="py-4 text-center text-gray-500">Loading goals...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Goal Name</TableHead>
                <TableHead>Target Value</TableHead>
                <TableHead>Unit</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {goals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-gray-500">
                    No goals available. Click &quot;Add Goal&quot; to create a new entry.
                  </TableCell>
                </TableRow>
              ) : (
                goals.map((goal, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={goal.name}
                        onChange={(e) => {
                          const newGoals = [...goals];
                          newGoals[index].name = e.target.value;
                          setGoals(newGoals);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={goal.target}
                        onChange={(e) => {
                          const newGoals = [...goals];
                          newGoals[index].target = Number(e.target.value);
                          setGoals(newGoals);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={goal.unit}
                        onChange={(e) => {
                          const newGoals = [...goals];
                          newGoals[index].unit = e.target.value;
                          setGoals(newGoals);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setGoals(goals.filter((_, i) => i !== index));
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