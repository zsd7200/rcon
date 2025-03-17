'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getData, deleteData } from '@/components/utils/ApiHandler';
import { ServersRow } from '@/db/RowTypes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAnglesRight, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'next-themes';
import { getToastStyles } from '@/components/utils/ToastStyles';
import toast from "react-hot-toast";
import Loading from '@/components/utils/Loading';
import { events, eventEmitter } from '@/components/utils/EventEmitter';

export default function Sidebar() {
  const [servers, setServers] = useState<Array<ServersRow>>([]);
  const [deleteMode, setDeleteMode] = useState<boolean>(false);
  const [deleteIds, setDeleteIds] = useState<Array<number>>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const [canToast, setCanToast] = useState<boolean>(true);
  const toastTimeoutMs = 3000;

  useEffect(() => {
    const getServers = async () => {
      const data = await getData('api/servers');
      setServers(data);
    };

    getServers();
    setRefresh(false);

    eventEmitter.addEventListener(events.sidebar, getServers);
    return () => eventEmitter.removeEventListener(events.sidebar, getServers);
  }, [refresh]);

  const deleteModeHandler = () => {
    setDeleteMode(!deleteMode);
  }

  const checkboxInputHandler = (id: number, checked: boolean) => {
    const tempIds = deleteIds;

    if (tempIds.includes(id) && !checked) {
      tempIds.splice(tempIds.indexOf(id), 1);
      setDeleteIds(tempIds);
      return;
    }

    if (!tempIds.includes(id) && checked) {
      tempIds.push(id);
      setDeleteIds(tempIds);
      return;
    }
  }

  const deleteHandler = async () => {
    if (deleteIds.length == 0 && canToast) {
      toast('No servers selected for deletion..', getToastStyles('⚠️', currentTheme));
      setCanToast(false);
      setTimeout(() => { setCanToast(true); }, toastTimeoutMs);
      return;
    }

    const badIds = [];
    setIsLoading(true);
    for (let i = 0; i < deleteIds.length; i++) {
      try {
        await deleteData(`api/servers/${deleteIds[i]}`);
      } catch (e) {
        badIds.push(deleteIds[i]);
        console.log(e);
        continue;
      }
    }

    setDeleteIds([]);
    setRefresh(true);
    setIsLoading(false);
    toast('Servers deleted!', getToastStyles('✅', currentTheme));
    if (badIds.length > 0) {
      toast(`Could not delete servers with the following IDs: ${badIds.join(', ')}`, getToastStyles('⚠️', currentTheme));
      toast(`Please contact developer with details!`, getToastStyles('⚠️', currentTheme));
    }
  }

  return (
    <div className="relative z-100 bg-gray-100 dark:bg-gray-900 inline-flex px-2 py-4 max-w-64 flex-col border-r-1 border-b-1 rounded-br-lg border-gray-200 dark:border-gray-700">
      <Link href={`/server/add`} className="hover:bg-[#98C767] active:bg-[#7FA656] py-2 px-2 my-px rounded-md">
        <div className="flex justify-between items-center gap-8">
          Add Server
          <FontAwesomeIcon icon={faPlus} className="text-xs" />
        </div>
      </Link>
      <button onClick={deleteModeHandler} className="hover:bg-[#98C767] active:bg-[#7FA656] py-2 px-2 my-px rounded-md hover:cursor-pointer">
        <div className="flex justify-between items-center gap-8">
          {(deleteMode) ? "Cancel Deleting" : "Delete Server(s)"}
          <FontAwesomeIcon icon={(deleteMode) ? faXmark : faTrash} className="text-xs" />
        </div>
      </button>
      {(deleteMode)
        ? 
          <>
            {servers.map((server) => (
              <div key={server.id} className="hover:bg-[#98C767] active:bg-[#7FA656] py-2 px-2 my-px rounded-md">
                <div className="flex justify-between items-center gap-8">
                  <span className="max-w-40 text-wrap break-words">{server.name}</span>
                  <input type="checkbox" id={`delete-${server.id}`} name={`delete-${server.id}`} onChange={(e: React.ChangeEvent<HTMLInputElement>) => checkboxInputHandler(server.id!, e.target.checked)} />
                </div>
              </div>
            ))}
          </>
        : 
          <>
            {servers.map((server) => (
              <Link key={server.id} href={`/server/${server.id}`} className="hover:bg-[#98C767] active:bg-[#7FA656] py-2 px-2 my-px rounded-md">
                <div className="flex justify-between items-center gap-8">
                  <span className="max-w-40 text-wrap break-words">{server.name}</span>
                  <FontAwesomeIcon icon={faAnglesRight} className="text-xs" />
                </div>
              </Link>
            ))}
          </>
      }
      {deleteMode && 
        <button onClick={deleteHandler} className="hover:bg-[#98C767] active:bg-[#7FA656] py-2 px-2 my-px rounded-md hover:cursor-pointer">
          <div className="flex justify-between items-center gap-8">
            <span>Delete Selected</span>
            <FontAwesomeIcon icon={faTrash} className="text-xs" />
          </div>
          <hr className="h-px w-3/4 mx-auto my-1 bg-gray-200 border-0 dark:bg-gray-700" />
          <span className="font-bold">This <span className="text-red-500">CANNOT</span> be undone!</span>
        </button>
      }
      {isLoading &&
        <Loading />
      }
    </div>
  );
}