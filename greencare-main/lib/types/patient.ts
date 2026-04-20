export interface Patient {
  mrNo: string;
  name: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  notes?: string;
  registrations: string[]; // IDs of registrations
  status:string;
}

export interface Registration {
  mrNo: string;
  name: string;
  gender?: string;
  age?: number;
  notes?: string;
  registrationDate: Date;
  qrCode?: string;
  waitingTime?: number;
}