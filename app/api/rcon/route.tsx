import { NextRequest, NextResponse } from 'next/server';
import Rcon from 'rcon-srcds';
import { RconConnectObjectType } from '@/components/rcon/RconInterface';

export async function POST(req: NextRequest) {
  const body: RconConnectObjectType = await req.json();
  const server = new Rcon({ host: body.host, port: body.port });

  try {
    await server.authenticate(body.password);
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 403});
  }

  try {
    let status = await server.execute(body.command);
    return NextResponse.json({status: 'good', msg: status}, {status: 200});
  } catch (err) {
    return NextResponse.json({status: 'bad', msg: err}, {status: 500});
  }
}