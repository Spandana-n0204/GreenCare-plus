// components/dashboard/DoctorWellbeingChart.tsx
"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DoctorWellbeingChartProps {
  data: {
    doctor: string;
    workload: number;
    stress: number;
  }[];
}

export function DoctorWellbeingChart({ data }: DoctorWellbeingChartProps) {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="doctor" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="workload" fill="#8884d8" name="Workload Level" />
          <Bar dataKey="stress" fill="#82ca9d" name="Stress Indicators" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}