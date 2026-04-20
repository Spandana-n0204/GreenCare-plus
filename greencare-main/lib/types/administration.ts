export interface Administration {
  letterNo: string;
  input?: string;
  endorsement?: string;
  reports: string[]; // Report IDs
  paperSaved: number;
  digitalTransactionCount: number;
}

export interface HealthOffice {
  officeId: string;
  reception: string[];
  sustainabilityMetrics?: {
    paperlessForms?: number;
    carbonOffset?: number;
    energyEfficiency?: number;
  };
}