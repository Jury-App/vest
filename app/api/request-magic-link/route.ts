import { NextResponse } from "next/server";
import { sendRecoveryMagicLink } from "@/lib/investor-ops";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        {
          error: "Email is required",
        },
        { status: 400 }
      );
    }

    await sendRecoveryMagicLink(email);

    return NextResponse.json({
      ok: true,
      message:
        "If we found an eligible account for that email, we sent you a link.",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
