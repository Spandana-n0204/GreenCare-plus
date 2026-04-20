"use client"

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function MetricsEditor({ hospitalId }: { hospitalId: string | null}) {
    const [metrics, setMetrics] = useState({
      paperSaved: 0,
      carbonReduction: 0,
      digitalAdoption: 0,
      energyEfficiency: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
  
    useEffect(() => {
      const fetchMetrics = async () => {
        if (!hospitalId) {
          setError("No hospital ID provided");
          return;
        }
        
        try {
          setLoading(true);
          const res = await fetch(`/api/sustainability/metrics?hospitalId=${hospitalId}`);
          
          if (!res.ok) {
            throw new Error(`Failed to fetch metrics: ${res.status}`);
          }
          
          const data = await res.json();
          setMetrics(data);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to load metrics");
        } finally {
          setLoading(false);
        }
      };
      
      fetchMetrics();
    }, [hospitalId]);
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!hospitalId) {
        setError("No hospital ID provided. Cannot save metrics.");
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        setSuccess(false);
        
        const res = await fetch(`/api/sustainability/metrics`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...metrics, hospitalId }),
        });
        
        if (!res.ok) {
          throw new Error(`Failed to save metrics: ${res.status}`);
        }
        
        const result = await res.json();
        
        if (result.success) {
          setSuccess(true);
        } else {
          throw new Error("Server returned unsuccessful response");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save metrics");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>Core Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-500">
              <AlertDescription>Metrics saved successfully!</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label>Paper Saved (sheets)</label>
                <Input
                  type="number"
                  value={metrics.paperSaved}
                  onChange={(e) => setMetrics({...metrics, paperSaved: Number(e.target.value)})}
                />
              </div>
              <div>
                <label>Carbon Reduction (tons CO₂e)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={metrics.carbonReduction}
                  onChange={(e) => setMetrics({...metrics, carbonReduction: Number(e.target.value)})}
                />
              </div>
              <div>
                <label>Digital Adoption (%)</label>
                <Input
                  type="number"
                  value={metrics.digitalAdoption}
                  onChange={(e) => setMetrics({...metrics, digitalAdoption: Number(e.target.value)})}
                />
              </div>
              <div>
                <label>Energy Efficiency (% reduction)</label>
                <Input
                  type="number"
                  value={metrics.energyEfficiency}
                  onChange={(e) => setMetrics({...metrics, energyEfficiency: Number(e.target.value)})}
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={loading || !hospitalId}
            >
              {loading ? "Saving..." : "Save Metrics"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }