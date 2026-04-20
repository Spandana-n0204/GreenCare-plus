"use client"

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InitiativeData {
  _id?: string;
  name: string;
  status: 'planned' | 'in-progress' | 'completed';
  impact: string;
  startDate?: string;
  completionDate?: string;
}

export default function InitiativesEditor({ hospitalId }: { hospitalId: string | null}) {
  const [initiatives, setInitiatives] = useState<InitiativeData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', message: string} | null>(null);

  useEffect(() => {
    const fetchInitiatives = async () => {
      if (!hospitalId) {
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        const res = await fetch(`/api/sustainability/initiatives?hospitalId=${hospitalId}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch initiatives: ${res.status}`);
        }
        
        const data = await res.json();
        setInitiatives(data);
      } catch (error) {
        console.error("Error fetching initiatives:", error);
        setFeedback({
          type: 'error',
          message: 'Failed to load initiatives. Please try again.'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitiatives();
  }, [hospitalId]);

  const handleAddInitiative = () => {
    setInitiatives([...initiatives, { name: "", status: "planned", impact: "" }]);
  };

  const validateInitiatives = () => {
    // Basic validation to ensure initiatives have names
    const invalidInitiatives = initiatives.filter(i => !i.name.trim());
    
    if (invalidInitiatives.length > 0) {
      setFeedback({
        type: 'error',
        message: 'All initiatives must have names. Please check your entries.'
      });
      return false;
    }
    
    return true;
  };

  const handleSave = async () => {
    if (!hospitalId) {
      setFeedback({
        type: 'error',
        message: 'No hospital selected. Please select a hospital first.'
      });
      return;
    }
    
    if (!validateInitiatives()) {
      return;
    }
    
    try {
      setIsSaving(true);
      setFeedback(null);
      
      const res = await fetch('/api/sustainability/initiatives', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: initiatives, hospitalId }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to save initiatives: ${res.status}`);
      }
      
      const result = await res.json();
      
      if (result.success) {
        setFeedback({
          type: 'success',
          message: 'Initiatives saved successfully!'
        });
        
        // Refresh the data to get updated IDs
        const refreshRes = await fetch(`/api/sustainability/initiatives?hospitalId=${hospitalId}`);
        if (refreshRes.ok) {
          const refreshedData = await refreshRes.json();
          setInitiatives(refreshedData);
        }
      } else {
        throw new Error('Operation returned success: false');
      }
    } catch (error) {
      console.error("Error saving initiatives:", error);
      setFeedback({
        type: 'error',
        message: 'Failed to save initiatives. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateInitiative = (index: number, field: keyof InitiativeData, value: any) => {
    const newInitiatives = [...initiatives];
    newInitiatives[index] = { ...newInitiatives[index], [field]: value };
    setInitiatives(newInitiatives);
  };

  const handleDeleteInitiative = (index: number) => {
    setInitiatives(initiatives.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-40">
            <div className="animate-pulse">Loading initiatives...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Green Initiatives</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleAddInitiative}>
              Add Initiative
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save All"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {feedback && (
          <Alert className={`mb-4 ${feedback.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            {feedback.type === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={feedback.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {feedback.message}
            </AlertDescription>
          </Alert>
        )}
        
        {!hospitalId && (
          <Alert className="mb-4 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              No hospital selected. Please select a hospital to manage initiatives.
            </AlertDescription>
          </Alert>
        )}
        
        {initiatives.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No initiatives found. Click "Add Initiative" to create your first green initiative.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Initiative Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Impact Description</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {initiatives.map((initiative, index) => (
                  <TableRow key={initiative._id || index}>
                    <TableCell>
                      <Input
                        value={initiative.name}
                        onChange={(e) => handleUpdateInitiative(index, 'name', e.target.value)}
                        placeholder="Initiative name"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={initiative.status}
                        onValueChange={(value) => handleUpdateInitiative(index, 'status', value as any)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="planned">Planned</SelectItem>
                          <SelectItem value="in-progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={initiative.impact}
                        onChange={(e) => handleUpdateInitiative(index, 'impact', e.target.value)}
                        placeholder="Environmental impact"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={initiative.startDate || ""}
                        onChange={(e) => handleUpdateInitiative(index, 'startDate', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="date"
                        value={initiative.completionDate || ""}
                        onChange={(e) => handleUpdateInitiative(index, 'completionDate', e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => handleDeleteInitiative(index)}
                        size="sm"
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}