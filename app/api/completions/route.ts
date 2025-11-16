import { NextRequest, NextResponse } from "next/server";
import { getCompletions } from "@/lib/actions/completion-actions";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const habitId = searchParams.get("habitId");
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate || !endDate) {
    return NextResponse.json(
      { error: "startDate and endDate are required" },
      { status: 400 }
    );
  }

  const completions = await getCompletions(
    habitId || undefined,
    new Date(startDate),
    new Date(endDate)
  );

  return NextResponse.json(completions);
}

