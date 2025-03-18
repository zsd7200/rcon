'use server';

import { redirect } from 'next/navigation';
import { DbResponse, getData } from '@/components/utils/ApiHandler';
import { ServersRow } from '@/db/RowTypes';
import RconInterface from '@/components/rcon/RconInterface';
import { decrypt } from '@/components/utils/PasswordOperations';
import { getUrl } from '@/components/utils/HeaderHandler';

type Params = Promise<{ id: string }>;

export default async function ServerId(props: { params: Params }) {
  const url = await getUrl();
  const params = await props.params;
  const response: Array<ServersRow> | DbResponse = await getData(`${url}/api/servers/${params.id}`);
  if (!params?.id || !Array.isArray(response) || response.length === 0) {
    return redirect('/');
  }

  const server = response[0];
  const decrypted = await decrypt(server.password);
  return (
    <>
      <h1 className="text-2xl font-bold text-center pb-16">
        <span className="rounded-lg px-4 py-1 bg-gray-100 dark:bg-[#18191B]">{server.name}</span>
      </h1>
      <RconInterface server_id={server.id!} host={server.host} port={parseInt(server.port)} password={decrypted} />
    </>
  );
};