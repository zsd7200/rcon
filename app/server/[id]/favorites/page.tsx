'use server';

import { redirect } from 'next/navigation';
import { DbResponse, getData } from '@/components/utils/ApiHandler';
import { ServersRow, FavoritesRow } from '@/db/RowTypes';

type Params = Promise<{ id: string }>;

export default async function ServerFavorites(props: { params: Params }) {
  const params = await props.params;
  const servResponse: Array<ServersRow> | DbResponse = await getData(`/api/servers/${params.id}`);

  if (!params?.id || !Array.isArray(servResponse) || servResponse.length === 0) {
    return redirect('/');
  }

  const favResponse: Array<FavoritesRow> | DbResponse = await getData(`/api/favorites/server/${params.id}`);

  if (!Array.isArray(favResponse)) {
    return redirect('/');
  }

  const server = servResponse[0];

  return (
    <>
      <h1 className="text-2xl font-bold text-center pb-16">
        <span className="rounded-lg px-4 py-1 bg-gray-100 dark:bg-[#18191B]">{server.name}</span>
      </h1>
      {favResponse.map((favorite, i) => (
        <div key={i} className={`${i % 2 == 0 ? 'bg-[#98C767]' : 'bg-[#7FA656]' } py-2 px-2 my-px rounded-md relative`}>
          <div className="flex flex-col">
            <span className="text-wrap break-words pr-6">{favorite.name}</span>
            <span className="text-xs italic">/{favorite.command}</span>
          </div>
        </div>
      ))}
    </>
  );
};