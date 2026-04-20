// app/api/init-dashboard/route.ts
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    
    // Initialize dashboard stats
    await db.collection("dashboard_stats").updateOne(
      {},
      {
        $set: {
          totalPatients: 1245,
          newRegistrations: 32,
          appointmentsToday: 78,
          avgWaitTime: 15,
          waitTimeChange: -5,
          registrationChange: 12
        }
      },
      { upsert: true }
    );
    
    // Initialize patient flow
    const patientFlowData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      count: Math.floor(Math.random() * 30) + (i > 8 && i < 17 ? 20 : 5)
    }));
    await db.collection("patient_flow").deleteMany({});
    await db.collection("patient_flow").insertMany(patientFlowData);
    
    // Initialize appointments
    const appointmentsData = [
      { department: "Cardiology" },
      { department: "Cardiology" },
      { department: "Neurology" },
      { department: "Pediatrics" },
      { department: "Pediatrics" },
      { department: "Pediatrics" },
      { department: "Orthopedics" }
    ];
    await db.collection("appointments").deleteMany({});
    await db.collection("appointments").insertMany(appointmentsData);
    
    // Initialize sustainability metrics
    await db.collection("sustainability_metrics").updateOne(
      {},
      {
        $set: {
          paperSaved: 12450,
          carbonReduction: 32,
          digitalAdoption: 75
        }
      },
      { upsert: true }
    );
    
    // Initialize doctor wellbeing
    const wellbeingData = [
      { doctor: "Dr. Smith", workload: 30, stress: 25 },
      { doctor: "Dr. Johnson", workload: 65, stress: 60 },
      { doctor: "Dr. Williams", workload: 45, stress: 40 }
    ];
    await db.collection("doctor_wellbeing").deleteMany({});
    await db.collection("doctor_wellbeing").insertMany(wellbeingData);
    
    // Initialize paper usage
    const paperUsageData = [
      { category: "Medical Records", percentage: 65 },
      { category: "Prescriptions", percentage: 20 },
      { category: "Administrative", percentage: 15 }
    ];
    await db.collection("paper_usage").deleteMany({});
    await db.collection("paper_usage").insertMany(paperUsageData);
    
    // Initialize digital adoption
    const digitalAdoptionData = [
      { category: "Patient Records", percentage: 85 },
      { category: "Prescriptions", percentage: 70 },
      { category: "Appointments", percentage: 90 },
      { category: "Billing", percentage: 60 }
    ];
    await db.collection("digital_adoption").deleteMany({});
    await db.collection("digital_adoption").insertMany(digitalAdoptionData);
    
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to initialize dashboard data' }, { status: 500 });
  }
}