import { NextRequest, NextResponse } from "next/server";
import { updateProjects } from "@/lib/queries";
import { Project } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const projects: Project[] = await req.json();
    await updateProjects(projects);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
