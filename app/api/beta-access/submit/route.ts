import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, email, intendedUse } = data;

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.FOUNDER_EMAIL!,
      subject: `New Beta Access Request from ${name}`,
      html: `
        <h2>New Beta Access Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Intended Use:</strong></p>
        <p>${intendedUse}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Beta Access API error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
