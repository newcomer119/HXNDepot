import connectDb from "@/config/db";
import Freelancer from "@/models/Freelancer";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);

    await connectDb();

    const body = await request.json();
    const {
      name,
      email,
      phone,
      category,
      experienceYears,
      serviceArea,
      description
    } = body;

    if (!name || !email || !phone || !category) {
      return NextResponse.json(
        { success: false, message: "Name, email, phone, and category are required." },
        { status: 400 }
      );
    }

    const validCategories = [
      "Installer", "Constructor", "Real Estate Agent", "Interior Designer",
      "Flooring Specialist", "Tile Installer", "General Contractor", "Plumber",
      "Electrician", "Painter", "Other"
    ];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, message: "Invalid category." },
        { status: 400 }
      );
    }

    const newFreelancer = await Freelancer.create({
      userId: userId || null,
      name,
      email,
      phone,
      category,
      experienceYears: experienceYears ? Number(experienceYears) : undefined,
      serviceArea: serviceArea || "",
      description: description || "",
      status: "approved"
    });

    return NextResponse.json({
      success: true,
      message: "Freelancer registration submitted successfully. You're now listed in our Find a Pro directory.",
      freelancer: newFreelancer
    });
  } catch (error) {
    console.error("Freelancer register error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Registration failed." },
      { status: 500 }
    );
  }
}
