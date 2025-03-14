import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbPost } from '@/db/Database';
import { HistoryRow } from '@/db/RowTypes';

export async function GET(req: NextRequest) {
  const query = `
    SELECT * from history
  `;
  try {
    const res = await dbGet(query);
    return NextResponse.json(res, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 500});
  }
}

export async function POST(req: NextRequest) {
  const body: HistoryRow = await req.json();

  if (!body.command) {
    return NextResponse.json({status: 'bad', msg: 'Missing command.'}, {status: 500});
  }

  const query = `
    INSERT INTO history(server_id, command, response)
    VALUES(?, ?, ?)
  `;
  const values = [body.server_id, body.command, body.response];
  try {
    const res = await dbPost(query, values);
    return NextResponse.json({status: 'good', msg: `Successfully added Command: ${body.command} to History for Server with ID: ${body.server_id}.`}, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 500});
  }
}