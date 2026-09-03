import { NextResponse } from "next/server";
import type { ApiResponse } from "@/shared/interface";

export function ok<T>(data: T, status = 200): NextResponse {
  const body: ApiResponse<T> = { success: true, data };
  return NextResponse.json(body, { status });
}

export function created<T>(data: T): NextResponse {
  return ok(data, 201);
}

export function fail(message: string, status = 400): NextResponse {
  const body: ApiResponse = { success: false, error: message };
  return NextResponse.json(body, { status });
}
