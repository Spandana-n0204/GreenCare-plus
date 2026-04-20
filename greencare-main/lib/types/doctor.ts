export interface Doctor {
  employeeId: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  specialists: string[];
  burnoutMetrics?: {
    workloadLevel?: number;
    stressIndicators?: number;
    lastAssessmentDate?: Date;
  };
}