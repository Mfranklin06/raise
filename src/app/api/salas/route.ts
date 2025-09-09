import { NextResponse } from "next/server";
import { getSalasData } from "@/lib/data";

export async function GET() {
  const salas = getSalasData();
  return NextResponse.json(salas);
}