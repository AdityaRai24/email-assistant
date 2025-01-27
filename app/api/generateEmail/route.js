import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const data = await req.json();
    return NextResponse.json(data,{status : 200});
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
