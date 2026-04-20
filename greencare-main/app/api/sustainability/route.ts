import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("greencare");
    
    // Get metrics data
    const metrics = await db.collection("sustainability_metrics").findOne({});
    
    const monthlyData = await db.collection("sustainability_monthly").find().sort({ month: 1 }).toArray();
    
    const departmentalData = await db.collection("sustainability_departments").find().toArray();
    
    // Get goals data
    const goals = await db.collection("sustainability_goals").find().toArray();
    
    // Get initiatives data
    const initiatives = await db.collection("sustainability_initiatives").find().toArray();

    return NextResponse.json({
      metrics,
      monthlyData: monthlyData.map(item => ({
        name: item.month,
        Paper: item.paperSaved,
        Carbon: item.carbonReduction,
        Energy: item.energyUsage
      })),
      departmentalData: departmentalData.map(item => ({
        name: item.department,
        value: item.paperReduction
      })),
      goals: goals.map(goal => ({
        name: goal.name,
        achieved: goal.achieved,
        goal: goal.target,
        percentage: Math.round((goal.achieved / goal.target) * 100),
        unit: goal.unit
      })),
      initiatives: initiatives.map(initiative => ({
        name: initiative.name,
        completed: initiative.status === 'completed',
        impact: initiative.impact
      }))
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch sustainability data' }, { status: 500 });
  }
}