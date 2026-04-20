"use client"

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AddDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddDoctorModal({ isOpen, onClose, onSuccess }: AddDoctorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    employeeId: '',
    gender: '',
    specialists: '',
    workloadLevel: 0,
    stressIndicators: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'workloadLevel' || name === 'stressIndicators' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const hospitalId = localStorage.getItem('hospitalId');
      const response = await fetch('/api/doctors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Hospital-ID': hospitalId || '',
        },
        body: JSON.stringify({
          ...formData,
          specialists: formData.specialists.split(',').map(s => s.trim()),
          burnoutMetrics: {
            workloadLevel: formData.workloadLevel,
            stressIndicators: formData.stressIndicators,
            lastAssessmentDate: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add doctor');
      }

      toast.success("Doctor added successfully");
      onSuccess();
    } catch (error) {
      console.error('Error adding doctor:', error);
      toast.error("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Doctor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employeeId">Employee ID</Label>
                <Input
                  id="employeeId"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Input
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialists">Specializations (comma separated)</Label>
                <Input
                  id="specialists"
                  name="specialists"
                  value={formData.specialists}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workloadLevel">Workload Level (%)</Label>
                <Input
                  type="number"
                  id="workloadLevel"
                  name="workloadLevel"
                  min="0"
                  max="100"
                  value={formData.workloadLevel}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stressIndicators">Stress Indicators (%)</Label>
                <Input
                  type="number"
                  id="stressIndicators"
                  name="stressIndicators"
                  min="0"
                  max="100"
                  value={formData.stressIndicators}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Doctor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}