import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbPost } from '@/db/Database';

type Params = Promise<{ id: string }>;

export async function GET(req: NextRequest, props: { params: Params }) {
  const params = await props.params;
  const id: string = params.id;

  if (!id) {
    return NextResponse.json({status: 'bad', msg: 'No ID specified.'}, {status: 400});
  }

  const query = `
    SELECT * from favorites
    WHERE id=${id}
  `;
  try {
    const res = await dbGet(query);
    return NextResponse.json(res, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 400});
  }
}

export async function DELETE(req: NextRequest, props: { params: Params }) {
  const params = await props.params;
  const id: string = params.id;

  if (!id) {
    return NextResponse.json({status: 'bad', msg: 'No ID specified.'}, {status: 400});
  }

  const query = `
    DELETE FROM favorites
    WHERE id=?
  `;
  const values = [id];

  try {
    await dbPost(query, values);
    return NextResponse.json({status: 'good', msg: `Successfully deleted Favorite with ID: ${id}.`}, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 400});
  }
}