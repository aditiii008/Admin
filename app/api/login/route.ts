import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (username === validUsername && password === validPassword) {
    const res = NextResponse.json({ success: true });
    // Set cookie for authentication
    res.cookies.set("admin-auth", "true", { path: "/" });
    return res;
  }

  return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
}
