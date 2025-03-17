import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbPost } from '@/db/Database';
import { FavoritesRow } from '@/db/RowTypes';

export async function GET() {
  const query = `
    SELECT * from favorites
  `;
  try {
    const res = await dbGet(query);
    return NextResponse.json(res, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 400});
  }
}

export async function POST(req: NextRequest) {
  const body: FavoritesRow = await req.json();

  if (!body.command) {
    return NextResponse.json({status: 'bad', msg: 'Missing command.'}, {status: 400});
  }

  if (!body.name) {
    body.name = body.command;
  }

  const query = `
    INSERT INTO favorites(server_id, name, command)
    VALUES(?, ?, ?)
  `;
  const values = [body.server_id, body.name, body.command];
  try {
    await dbPost(query, values);
    return NextResponse.json({status: 'good', msg: `Successfully added Favorite with name: ${body.name} to Server with ID: ${body.server_id}.`}, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 400});
  }
}