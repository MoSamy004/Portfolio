import { NextRequest, NextResponse } from "next/server";
import { updateExperiences } from "@/lib/queries";
import { Experience } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const experiences: Experience[] = await req.json();
    await updateExperiences(experiences);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
