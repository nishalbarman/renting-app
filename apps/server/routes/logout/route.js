const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const response = NextResponse.json({
      status: true,
      message: "Logout successful",
    });

    return response;
  } catch (error) {
    console.log("Is there any error --->", error);
    return NextResponse.json(
      { status: false, message: "Logout failed" },
      { status: 500 }
    );
  }
}

// need to implement token blacklisting
