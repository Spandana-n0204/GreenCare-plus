export interface MedicalRecord {
  mrNo: string;
  date: Date;
  diagnoses: string[];
  drugs: Drug[];
  reference?: string;
  filledBy: string; // Doctor ID
}

export interface Drug {
  name: string;
  dosage: string;
  sustainabilityRating?: number; // Scale 1-10
  carbonFootprint?: number; // In g CO2e
}