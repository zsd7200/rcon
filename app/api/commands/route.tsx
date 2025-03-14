import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbPost } from '@/db/Database';
import { CommandsRow } from '@/db/RowTypes';

export async function GET(req: NextRequest) {
  const query = `
    SELECT * from commands
  `;
  try {
    const res = await dbGet(query);
    return NextResponse.json(res, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 500});
  }
}

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const data: CommandsRow = {
    server_id:  body.get('server_id') as string,
    name:       body.get('name') as string,
    command:    body.get('command') as string,
  };

  if (!data.command) {
    return NextResponse.json({status: 'bad', msg: 'Missing command.'}, {status: 500});
  }

  if (!data.name) {
    data.name = data.command;
  }

  const query = `
    INSERT INTO commands(server_id, name, command)
    VALUES(?, ?, ?)
  `;
  const values = [data.server_id, data.name, data.command];
  try {
    const res = await dbPost(query, values);
    return NextResponse.json({status: 'good', msg: `Successfully added Command with name: ${data.name} to Server with ID: ${data.server_id}.`}, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 500});
  }
}