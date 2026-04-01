import { NextResponse } from "next/server";
import { getOpsSecret, syncApprovedInvestments } from "@/lib/investor-ops";

function isAuthorized(req: Request) {
  const authHeader = req.headers.get("authorization");
  return authHeader === `Bearer ${getOpsSecret()}`;
}

export async function POST(req: Request) {
  try {
    if (!isAuthorized(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sentInvestmentIds = await syncApprovedInvestments();
    return NextResponse.json({
      ok: true,
      sentInvestmentIds,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
