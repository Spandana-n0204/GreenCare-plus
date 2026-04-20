import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import bcrypt from 'bcryptjs';
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    console.log("[POST] /api/auth/register - Request received");

    const body = await request.json();
    console.log("[POST] Parsed body:", body);

    const { name, email, password, hospitalType, address, phone, registrationDate, sustainabilityMetrics } = body;

    // Validate required fields
    if (!name || !email || !password || !hospitalType || !address || !phone) {
      console.warn("[POST] Missing required fields");
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("greencare");
    console.log("[POST] Connected to DB");

    // Check if email already exists
    const existingHospital = await db.collection("hospitals").findOne({ email });
    if (existingHospital) {
      console.warn("[POST] Email already registered:", email);
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("[POST] Password hashed");

    // Create hospital document
    const result = await db.collection("hospitals").insertOne({
      name,
      email,
      password: hashedPassword,
      hospitalType,
      address,
      phone,
      registrationDate: new Date(registrationDate),
      sustainabilityMetrics: {
        paperSaved: 0,
        carbonOffset: 0,
        energyEfficiency: 100,
        ...sustainabilityMetrics
      },
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log("[POST] Hospital inserted with ID:", result.insertedId);

    // Record this as a new sustainable action
    const metricUpdateResult = await db.collection("sustainability_metrics").updateOne(
      { date: new Date().toISOString().split('T')[0] },
      {
        $inc: {
          digitalRegistrations: 1,
          paperSaved: 15 // Estimate of paper saved by digital hospital registration
        }
      },
      { upsert: true }
    );
    console.log("[POST] Sustainability metrics updated:", metricUpdateResult);

    // Return success but don't include the password
    return NextResponse.json({
      success: true,
      hospital: {
        _id: result.insertedId,
        name,
        email,
        hospitalType,
        address,
        phone
      }
    });
  } catch (e) {
    console.error("[POST] Error during registration:", e);
    return NextResponse.json(
      { error: 'Failed to register hospital' },
      { status: 500 }
    );
  }
}
