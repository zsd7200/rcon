import { redirect } from 'next/navigation';
import { DbResponse, getData } from '@/components/utils/ApiHandler';
import { ServersRow } from '@/db/RowTypes';

type Params = Promise<{ id: string }>;

export default async function ServerId(props: { params: Params }) {
  const params = await props.params;
  const response: Array<ServersRow> | DbResponse = await getData(`/api/servers/${params.id}`);
  if (!params?.id || !Array.isArray(response) || response.length === 0) {
    return redirect('/');
  }

  const server = response[0];
  return (
    <>
      <h1 className="text-2xl font-bold text-center pb-16">
        <span className="rounded-lg px-4 py-1 bg-gray-100 dark:bg-[#18191B]">{server.name}</span>
      </h1>
    </>
  );
};