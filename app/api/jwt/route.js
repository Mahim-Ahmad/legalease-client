import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const token = jwt.sign(
    { email: session.user.email, name: session.user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  return NextResponse.json({ token });
}
