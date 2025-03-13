import Link from 'next/link';
import fetchData from '@/components/utils/FetchData';
import { ServersRow } from '@/db/RowTypes';

export default async function Sidebar() {
  const getApiUrl = () => {
    const url: string =
      process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/api/database/servers`
        : `http://localhost:3000/api/database/servers`;
    return url;
  }
  const servers: Array<ServersRow> = await fetchData(getApiUrl());

  return (
    <>
      {servers.map((server, index) => (
        <div key={index}>
          <span>{server.name}</span>
        </div>
      ))}
      <hr className="h-px mb-8 bg-gray-200 border-0 dark:bg-gray-700" />
    </>
  );
}