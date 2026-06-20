export async function GET() {
  const res = await fetch("http://127.0.0.1:8000/api/mail/send-test", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    return Response.json(
      {
        success: false,
        error: "Whalez-Mail service failed",
        status: res.status,
      },
      { status: 500 }
    );
  }

  const data = await res.json();

  return Response.json({
    success: true,
    provider: "whalez-mail",
    data,
  });
}
