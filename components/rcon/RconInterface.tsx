'use client';

import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faCopy } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { useTheme } from 'next-themes';
import { getToastStyles } from '@/components/utils/ToastStyles';
import toast from "react-hot-toast";
import Loading from '@/components/utils/Loading';
import { getData, postData, deleteData } from '@/components/utils/ApiHandler';
import { DbResponse } from '@/components/utils/ApiHandler';
import { FavoritesRow, HistoryRow } from '@/db/RowTypes';

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

type ResponseType = {
  cmd: string,
  msg: string,
  favorite: boolean,
}

export default function RconInterface({ server_id, host, port, password }: RconProps) {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const [responseList, setResponseList] = useState<Array<ResponseType>>([]);
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
      rconRes = await postData('api/rcon', rconConnectObject);
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

        await postData('api/history', historyObject);
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
    const getFavoritesList = async () => {
      try {
        const data: Array<FavoritesRow> = await getData(`api/favorites/server/${server_id}`);
        setFavoritesList(data);
        return data;
      } catch (e) {
        const err = e as Error;
        const res = JSON.parse(err.message) as DbResponse;
        toast(`Error getting Favorites List: ${res.msg}`, getToastStyles('⚠️', currentTheme));
        return [];
      }
    }

    const getHistoryList = async () => {
      try {
        const data: Array<HistoryRow> = await getData(`api/history/server/${server_id}/10`);
        const reversedData: Array<HistoryRow> = data.reverse(); // need to reverse because API sends it in opposite order of what we want
        setHistoryList(reversedData);
        setHistoryIndex(reversedData.length - 1);
        return reversedData;
      } catch (e) {
        const err = e as Error;
        const res = JSON.parse(err.message) as DbResponse;
        console.log(res.msg);
        toast(`Error getting History List: ${res.msg}`, getToastStyles('⚠️', currentTheme));
        return [];
      }
    }

    const initCmdList = async () => {
      const tempFavList = await getFavoritesList(); // favoritesList isn't populated, so we'll use this instead
      const tempResList = [];
      const data = await sendCommand('list', false);
      if (data.status !== 'good') {
        toast(`Error connecting to server via RCON. Error code: ${JSON.parse(data.msg).code}`, getToastStyles('⚠️', currentTheme));
        console.log('aaa');
        return;
      }
      const resData: ResponseType = {
        cmd: 'list',
        msg: data.msg,
        favorite: (tempFavList.find(fav => fav.command === 'list')) ? true : false,
      };
      tempResList.push(resData);
      setResponseList(tempResList);
      setDisabled(false);
    }

    initCmdList();
    getHistoryList();
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
    const resData: ResponseType = {
      cmd: target.value,
      msg: (response.msg.length > 0) ? response.msg : `Sent the following command with no response: /${target.value}`,
      favorite: (favoritesList.find(fav => fav.command === target.value)) ? true : false, 
    };
    tempResList.push(resData);
    setResponseList(tempResList);
    target.value = '';
  }
  
  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command)
      .then(() => { toast(`Copied to Clipboard: ${command}`, getToastStyles('✅', currentTheme)); })
      .catch((err) => { toast(`Could not Copy to Clipboard: ${err}`, getToastStyles('⚠️', currentTheme)); });
  }

  const handleFavorite = async (response: ResponseType) => {
    const tempResList = [...responseList];
    const adding = !response.favorite;
    for (let i = 0; i < tempResList.length; i++) {
      if (tempResList[i].cmd === response.cmd) {
        tempResList[i].favorite = !tempResList[i].favorite;
      }
    }

    try {
      if (adding) {
        const favoritesObject: FavoritesRow = {
          server_id: '' + server_id,
          name: response.cmd.split(' ')[0],
          command: response.cmd,
        }
        await postData('api/favorites', favoritesObject);
        const tempFavList = [...favoritesList];
        tempFavList.push(favoritesObject);
        setFavoritesList(tempFavList);
      } else {
        await deleteData(`api/favorites/server/${server_id}/${response.cmd}`);
        const tempFavList = [...favoritesList];
        tempFavList.splice(tempFavList.findIndex(fav => fav.command === response.cmd), 1);
        setFavoritesList(tempFavList);
      }
      toast(`${(adding) ? 'Added to' : 'Removed from'} favorites!`, getToastStyles('✅', currentTheme));
      setResponseList(tempResList);
    } catch (e) {
      const err = e as Error;
      const res = JSON.parse(err.message) as DbResponse;
      toast(`Error handling Favorite: ${res.msg}`, getToastStyles('⚠️', currentTheme));
      return res;
    }
  }

  return (
    <div className="flex flex-col w-1/4 mx-auto">
      {responseList.map((response, i) => (
        <div key={i} className={`${i % 2 == 0 ? 'bg-[#98C767]' : 'bg-[#7FA656]' } py-2 px-2 my-px rounded-md relative`}>
          <div className="flex flex-col">
            <span className="text-wrap break-words pr-6">{response.msg}</span>
            <span className="text-xs italic">/{response.cmd}</span>
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <button onClick={() => copyToClipboard(response.cmd)} className="text-xs hover:cursor-pointer" title="Copy Command to Clipboard">
              <FontAwesomeIcon icon={faCopy} />
            </button>
            <button onClick={() => handleFavorite(response)} className="text-xs hover:cursor-pointer" title={(response.favorite) ? "Remove from Favorites" : "Add to Favorites"}>
              <FontAwesomeIcon icon={(response.favorite) ? faHeartSolid : faHeart} />
            </button>
          </div>
        </div>
      ))}
      <div className="flex justify-between">
        <label htmlFor="host">Enter Command: </label>
        <input className="pl-2 w-50" name="host" id="host" placeholder="list" onKeyDown={handleKeyDown} onKeyUp={handleKeyUp} disabled={disabled} autoComplete="off" />
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