'use server';

import { redirect } from 'next/navigation';
import { DbResponse, getData } from '@/components/utils/ApiHandler';
import { ServersRow } from '@/db/RowTypes';
import RconInterface from '@/components/rcon/RconInterface';
import { decrypt } from '@/components/utils/PasswordOperations';
import { getUrl } from '@/components/utils/HeaderHandler';
import Link from 'next/link';

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
      <div className="flex flex-col items-center pb-12">
        <h1 className="text-2xl font-bold text-center pb-4">
          <span className="rounded-lg px-4 py-1 bg-gray-100 dark:bg-[#18191B]">{server.name}</span>
        </h1>
        <div className="flex gap-x-4">
          <Link href={`/server/${server.id}/favorites`} className="hover:bg-[#98C767] active:bg-[#7FA656] py-2 px-2 my-px rounded-md">
            <span>
              Favorites
            </span>
          </Link>
          <Link href={`/server/${server.id}/history`} className="hover:bg-[#98C767] active:bg-[#7FA656] py-2 px-2 my-px rounded-md">
            <span>
              History
            </span>
          </Link>
        </div>
      </div>
      <RconInterface server_id={server.id!} host={server.host} port={parseInt(server.port)} password={decrypted} />
    </>
  );
};