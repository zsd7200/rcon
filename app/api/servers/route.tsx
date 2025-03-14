import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbPost } from '@/db/Database';
import { ServersRow } from '@/db/RowTypes';
import { placeholders } from '@/components/utils/FormPlaceholders';

export async function GET(req: NextRequest) {
  const query = `
    SELECT * from servers
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
  const data: ServersRow = {
    name: body.get('name') as string,
    host: body.get('host') as string,
    port: body.get('port') as string,
  };

  if (!data.name || data.name.length === 0) {
    data.name = placeholders.name;
  }

  if (!data.host || data.host.length === 0) {
    data.host = placeholders.host;
  }

  if (!data.port || data.port.length === 0 || Number.isNaN(parseInt(data.port))) {
    data.port = placeholders.port;
  }

  const query = `
    INSERT INTO servers(name, host, port)
    VALUES(?, ?, ?)
  `;
  const values = [data.name, data.host, data.port];
  try {
    const res = await dbPost(query, values);
    return NextResponse.json({status: 'good', msg: `Successfully added Server with name: ${data.name}.`}, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 500});
  }
}