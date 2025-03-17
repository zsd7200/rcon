import { NextRequest, NextResponse } from "next/server";
import { dbPost } from '@/db/Database';

type Params = Promise<{ server_id: string, command: string }>;

export async function DELETE(req: NextRequest, props: { params: Params }) {
  const params = await props.params;
  const server_id: string = params.server_id;
  const command: string = params.command;

  if (!server_id || !command) {
    return NextResponse.json({status: 'bad', msg: 'Missing Server ID or Command.'}, {status: 400});
  }

  const query = `
    DELETE from favorites
    WHERE 
      server_id=? AND
      command=?
  `;
  const values = [server_id, command];

  try {
    const res = await dbPost(query, values);
    return NextResponse.json(res, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 400});
  }
}