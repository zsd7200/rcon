'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouseChimney, faBars, faXmark, faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from 'next-themes';
import { getToastStyles } from '@/components/utils/ToastStyles';
import toast from "react-hot-toast";
import Loading from '@/components/utils/Loading';
import { postData } from '@/components/utils/ApiHandler';
import { DbResponse } from '@/components/utils/ApiHandler';
import { GSP_NO_RETURNED_VALUE } from 'next/dist/lib/constants';
import { HistoryRow } from '@/db/RowTypes';

type RconProps = {
  server_id: number,
  host: string,
  port: number,
  password: string,
}

export type RconConnectObjectType = {
  host: string,
  port: number,
  password: string,
  command: string,
}

export default function RconInterface({ server_id, host, port, password }: RconProps) {
  const [responseList, setResponseList] = useState<Array<string>>([]);

  const sendCommand = async (command: string) => {
    const rconConnectObject: RconConnectObjectType = {
      host: host,
      port: port,
      password: password,
      command: command,
    }

    try {
      const rconRes: DbResponse = await postData('api/rcon', rconConnectObject);

      const historyObject: HistoryRow = {
        server_id: '' + server_id,
        command: command,
        response: (rconRes.msg.length > 0) ? rconRes.msg : 'no response',
      }

      const histRes: DbResponse = await postData('api/history', historyObject);
      return rconRes.msg;
    } catch (e) {
      return 'error';
    }
  }

  useEffect(() => {
    const initCmdList = async () => {
      const tempResList = [];
      const data = await sendCommand('list');
      tempResList.push(data);
      setResponseList(tempResList);
    }

    initCmdList();
  }, []);

  const handleKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;

    const target = e.target as HTMLInputElement;
    const response = await sendCommand(target.value);
    const tempResList = [...responseList];
    tempResList.push((response.length > 0) ? response : `Sent the following command with no response: /${target.value}`);
    setResponseList(tempResList);
    console.log(responseList);
    target.value = '';
  }

  return (
    <div className="flex flex-col w-1/4 mx-auto">
      {responseList.map((response, i) => (
        <div key={i} className={`${i % 2 == 0 ? 'bg-[#98C767]' : 'bg-[#7FA656]' } py-2 px-2 my-px rounded-md`}>
          <div className="flex justify-between items-center gap-8">
            <span className="text-wrap break-words">{response}</span>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <label htmlFor="host">Enter Command: </label>
        <input className="pl-2 w-50" name="host" id="host" placeholder="list" onKeyUp={handleKeyUp} />
      </div>
    </div>
  );
}