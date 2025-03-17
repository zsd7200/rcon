import { NextRequest, NextResponse } from "next/server";
import { dbGet } from '@/db/Database';

type Params = Promise<{ server_id: string, limit: string }>;

export async function GET(req: NextRequest, props: { params: Params }) {
  const params = await props.params;
  const server_id: string = params.server_id;
  const limit: number = parseInt(params.limit) ?? 10;

  if (!server_id) {
    return NextResponse.json({status: 'bad', msg: 'No ID specified.'}, {status: 400});
  }

  const query = `
    SELECT * from history
    WHERE server_id=${server_id}
    ORDER BY id DESC
    LIMIT ${limit}
  `;
  try {
    const res = await dbGet(query);
    return NextResponse.json(res, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 400});
  }
}