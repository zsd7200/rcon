'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { getToastStyles } from '@/components/utils/ToastStyles';
import toast from "react-hot-toast";
import Loading from '@/components/utils/Loading';
import { postData } from '@/components/utils/ApiHandler';
import { DbResponse } from '@/components/utils/ApiHandler';
import { FavoritesRow, HistoryRow } from '@/db/RowTypes';
import Message, { MsgProps } from '@/components/rcon/Message';
import { getFavoritesList, getHistoryList } from '@/components/utils/GetLists';

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
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const [responseList, setResponseList] = useState<Array<MsgProps>>([]);
  const [favoritesList, setFavoritesList] = useState<Array<FavoritesRow>>([]);
  const [historyList, setHistoryList] = useState<Array<HistoryRow>>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [pending, setPending] = useState<boolean>(false);
  const [currCmd, setCurrCmd] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(true);

  const sendCommand = async (command: string, log: boolean = true) => {
    setPending(true);
    setCurrCmd(command);
    const rconConnectObject: RconConnectObjectType = {
      host: host,
      port: port,
      password: password,
      command: command,
    }
    let rconRes: DbResponse;

    try {
      rconRes = await postData('/api/rcon', rconConnectObject);
    } catch (e) {
      const err = e as Error;
      const res = JSON.parse(err.message) as DbResponse;
      setPending(false);
      setCurrCmd('');
      return res;
    }

    try {
      if (log) {
        const historyObject: HistoryRow = {
          server_id: '' + server_id,
          command: command,
          response: (rconRes.msg.length > 0) ? rconRes.msg : 'no response',
        }

        await postData('/api/history', historyObject);
        const tempHistList = historyList;
        tempHistList.push(historyObject);
        setHistoryList(tempHistList);
        setHistoryIndex(tempHistList.length - 1);
      }
      setPending(false);
      setCurrCmd('');
      return { status: 'good', msg: rconRes.msg };
    } catch (e) {
      const err = e as Error;
      const res = JSON.parse(err.message) as DbResponse;
      setPending(false);
      setCurrCmd('');
      return res;
    }
  }

  useEffect(() => {
    const init = async () => {
      const tempFavList = await getFavoritesList(server_id); // favoritesList isn't populated, so we'll use this instead
      const tempHistList = await getHistoryList(server_id);
      const tempResList = [];
      const data = await sendCommand('list', false);
      if (data.status !== 'good') {
        toast(`Error connecting to server via RCON. Error code: ${JSON.parse(data.msg).code}`, getToastStyles('⚠️', currentTheme));
        return;
      }
      if (!Array.isArray(tempFavList)) {
        toast(`Error getting Favorites List: ${tempFavList}`, getToastStyles('⚠️', currentTheme));
        return;
      }
      if (!Array.isArray(tempHistList)) {
        toast(`Error getting History List: ${tempHistList}`, getToastStyles('⚠️', currentTheme));
        return;
      }
      const resData: MsgProps = {
        cmd: 'list',
        msg: data.msg,
        favorite: (tempFavList.find(fav => fav.command === 'list')) ? true : false,
      };
      tempResList.push(resData);
      setResponseList(tempResList);
      setFavoritesList(tempFavList);
      setHistoryList(tempHistList);
      setHistoryIndex(tempHistList.length - 1);
      setDisabled(false);
    }

    init();
  }, []);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown') return;
  
    const target = e.target as HTMLInputElement;
    target.value = historyList[historyIndex].command;
    let newIndex = historyIndex;
    if (e.key === 'ArrowUp' && newIndex - 1 >= 0) {
      newIndex--;
    } else if (e.key === 'ArrowDown' && newIndex + 1 < historyList.length) {
      newIndex++;
    }
    
    if (newIndex !== historyIndex) setHistoryIndex(newIndex);
  }

  const handleKeyUp = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return;
    
    const target = e.target as HTMLInputElement;
    const response = await sendCommand(target.value);
    const tempResList = [...responseList];
    const resData: MsgProps = {
      cmd: target.value,
      msg: (response.msg.length > 0) ? response.msg : `Sent the following command with no response: /${target.value}`,
      favorite: (favoritesList.find(fav => fav.command === target.value)) ? true : false, 
    };
    tempResList.push(resData);
    setResponseList(tempResList);
    target.value = '';
  }

  return (
    <div className="flex flex-col w-3/4 xl:w-1/2 mx-auto">
      {responseList.map((response, i) => (
        <Message 
          key={i} 
          server_id={server_id}
          msg={response.msg} 
          cmd={response.cmd} 
          favorite={response.favorite} 
          bg={i % 2 == 0 ? 'light' : 'dark'}
        />
      ))}
      <div className="flex justify-between pt-4">
        <label htmlFor="host">Enter Command: </label>
        <input className="pl-2 w-1/2" name="host" id="host" placeholder="list" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} disabled={disabled} autoComplete="off" />
      </div>
      {pending && 
        <Loading>
          <div className="flex flex-col mt-8 text-xs">
            <span className="italic">Sending command:</span>
            <span>/{currCmd}</span>
          </div>
        </Loading>
      }
    </div>
  );
}