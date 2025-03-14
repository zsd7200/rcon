import { NextRequest, NextResponse } from 'next/server';
import { dbGet, dbPost } from '@/db/Database';
import { ServersRow } from '@/db/RowTypes';
import { placeholders } from '@/components/utils/FormPlaceholders';
import { encrypt } from '@/components/utils/PasswordOperations';

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
    password: body.get('password') as string,
  };

  if (!data.password || data.password.length === 0) {
    return NextResponse.json({status: 'bad', msg: 'No password entered.'}, {status: 400});
  }

  if (!data.name || data.name.length === 0) {
    data.name = placeholders.name;
  }

  if (!data.host || data.host.length === 0) {
    data.host = placeholders.host;
  }

  if (!data.port || data.port.length === 0 || Number.isNaN(parseInt(data.port))) {
    data.port = placeholders.port;
  }

  data.password = await encrypt(data.password);

  const query = `
    INSERT INTO servers(name, host, port, password)
    VALUES(?, ?, ?, ?)
  `;
  const values = [data.name, data.host, data.port, data.password];
  try {
    const res = await dbPost(query, values);
    return NextResponse.json({status: 'good', msg: `Successfully added Server with name: ${data.name}.`}, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 500});
  }
}