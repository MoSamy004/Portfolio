import { NextRequest, NextResponse } from "next/server";
import { getPortfolio } from "@/lib/queries";

export async function GET(_req: NextRequest) {
  try {
    const portfolio = await getPortfolio();
    return NextResponse.json(portfolio);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
