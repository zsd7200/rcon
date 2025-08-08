'use server';

import { redirect } from 'next/navigation';
import { DbResponse, getData } from '@/components/utils/ApiHandler';
import { ServersRow, HistoryRow } from '@/db/RowTypes';
import { getUrl } from '@/components/utils/HeaderHandler';
import Link from 'next/link';
import Message from '@/components/rcon/Message';
import { getFavoritesList } from '@/components/utils/GetLists';

type Params = Promise<{ id: string }>;

export default async function ServerFavorites(props: { params: Params }) {
  const url = await getUrl();
  const params = await props.params;
  const servResponse: Array<ServersRow> | DbResponse = await getData(`${url}/api/servers/${params.id}`);

  if (!params?.id || !Array.isArray(servResponse) || servResponse.length === 0) {
    return redirect('/');
  }

  const histResponse: Array<HistoryRow> | DbResponse = await getData(`${url}/api/history/server/${params.id}`);

  if (!Array.isArray(histResponse)) {
    return redirect('/');
  }

  const server = servResponse[0];
  const favList = await getFavoritesList(server.id!);

  const isCmdInFavorites = (cmd: string) => {
    if (!Array.isArray(favList)) {
        return false;
    }

    return (favList.find(fav => fav.command === cmd)) ? true : false;
  }

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
          <Link href={`/server/${server.id}`} className="hover:bg-[#98C767] active:bg-[#7FA656] py-2 px-2 my-px rounded-md">
            <span>
              Back
            </span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col w-3/4 xl:w-1/2 mx-auto">
        {histResponse.map(async (history, i) => (
          <Message 
            key={i} 
            server_id={server.id}
            msg={history.response} 
            cmd={history.command} 
            favorite={isCmdInFavorites(history.command)}
            timestamp={history.time}
            bg={i % 2 == 0 ? 'light' : 'dark'}
          />
        ))}
      </div>
    </>
  );
};