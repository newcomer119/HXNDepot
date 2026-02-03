import connectDb from "@/config/db";
import Freelancer from "@/models/Freelancer";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await connectDb();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const status = searchParams.get("status") || "approved";

    const query = { status };
    if (category) query.category = category;

    const freelancers = await Freelancer.find(query)
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      freelancers
    });
  } catch (error) {
    console.error("Freelancer list error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to fetch freelancers." },
      { status: 500 }
    );
  }
}
