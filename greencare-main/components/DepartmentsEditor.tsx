"use client"

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DepartmentData {
  _id?: string;
  department: string;
  paperReduction: number;
}

export default function DepartmentsEditor({ hospitalId }: { hospitalId: string | null }) {
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      if (!hospitalId) {
        setError("No hospital ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const res = await fetch(`/api/sustainability/departments?hospitalId=${hospitalId}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch departments: ${res.status}`);
        }
        
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load departments");
      } finally {
        setLoading(false);
      }
    };
    
    fetchDepartments();
  }, [hospitalId]);

  const handleAddDepartment = () => {
    setDepartments([...departments, { department: "", paperReduction: 0 }]);
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
      
      const res = await fetch('/api/sustainability/departments', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: departments, hospitalId }),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to save departments: ${res.status}`);
      }
      
      const result = await res.json();
      
      if (result.success) {
        setSuccess(true);
      } else {
        throw new Error("Server returned unsuccessful response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save departments");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Departmental Paper Reduction</CardTitle>
          <div className="space-x-2">
            <Button variant="outline" onClick={handleAddDepartment} disabled={loading}>
              Add Department
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
            <AlertDescription>Departments saved successfully!</AlertDescription>
          </Alert>
        )}
        
        {loading && !departments.length ? (
          <div className="py-4 text-center text-gray-500">Loading departments...</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Department</TableHead>
                <TableHead>Paper Reduction (%)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-6 text-gray-500">
                    No departments available. Click &quot;Add Department&quot; to create a new entry.
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((dept, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={dept.department}
                        onChange={(e) => {
                          const newData = [...departments];
                          newData[index].department = e.target.value;
                          setDepartments(newData);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={dept.paperReduction}
                        onChange={(e) => {
                          const newData = [...departments];
                          newData[index].paperReduction = Number(e.target.value);
                          setDepartments(newData);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setDepartments(departments.filter((_, i) => i !== index));
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