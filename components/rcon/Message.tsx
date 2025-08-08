'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faCopy } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { useTheme } from 'next-themes';
import { getToastStyles } from '@/components/utils/ToastStyles';
import toast from "react-hot-toast";
import { postData, deleteData } from '@/components/utils/ApiHandler';
import { DbResponse } from '@/components/utils/ApiHandler';
import { FavoritesRow } from '@/db/RowTypes';

export type MsgProps = {
    server_id?: number,
    msg: string,
    cmd: string,
    favorite: boolean,
    timestamp?: string,
    bg?: 'light' | 'dark',
}

export default function Message({ server_id, msg, cmd, favorite, timestamp, bg }: MsgProps) {
  const { systemTheme, theme } = useTheme();
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const [fav, setFav] = useState<Boolean>(favorite);
  const [responseList, setResponseList] = useState<Array<MsgProps>>([]);
  const [favoritesList, setFavoritesList] = useState<Array<FavoritesRow>>([]);
  const bgColor = (bg && bg == 'light')
    ? 'bg-[#98C767]'
    : 'bg-[#7FA656]';
  
  const copyToClipboard = (command: string) => {
    navigator.clipboard.writeText(command)
      .then(() => { toast(`Copied to Clipboard: ${command}`, getToastStyles('✅', currentTheme)); })
      .catch((err) => { toast(`Could not Copy to Clipboard: ${err}`, getToastStyles('⚠️', currentTheme)); });
  }

  const handleFavorite = async () => {
    const tempResList = [...responseList];
    const adding = !fav;
    for (let i = 0; i < tempResList.length; i++) {
      if (tempResList[i].cmd === cmd) {
        tempResList[i].favorite = !tempResList[i].favorite;
      }
    }

    try {
      if (adding) {
        const favoritesObject: FavoritesRow = {
          server_id: '' + server_id,
          name: cmd.split(' ')[0],
          command: cmd,
        }
        await postData('/api/favorites', favoritesObject);
        const tempFavList = [...favoritesList];
        tempFavList.push(favoritesObject);
        setFavoritesList(tempFavList);
      } else {
        await deleteData(`/api/favorites/server/${server_id}/${cmd}`);
        const tempFavList = [...favoritesList];
        tempFavList.splice(tempFavList.findIndex(fav => fav.command === cmd), 1);
        setFavoritesList(tempFavList);
      }
      toast(`${(adding) ? 'Added to' : 'Removed from'} favorites!`, getToastStyles('✅', currentTheme));
      setResponseList(tempResList);
      setFav(!fav);
    } catch (e) {
      const err = e as Error;
      const res = JSON.parse(err.message) as DbResponse;
      toast(`Error handling Favorite: ${res.msg}`, getToastStyles('⚠️', currentTheme));
      return res;
    }
  }

  return (
    <div className={`${bgColor} py-2 px-2 my-px rounded-md relative`}>
        <div className="flex flex-col">
        <span className="text-wrap break-words pr-6">{msg}</span>
          <div className="flex justify-between text-xs italic">
            <span>/{cmd}</span>
            <span>{timestamp}</span>
          </div>
        </div>
        <div className="absolute top-2 right-2 flex gap-1">
        <button onClick={() => copyToClipboard(cmd)} className="text-xs hover:cursor-pointer" title="Copy Command to Clipboard">
            <FontAwesomeIcon icon={faCopy} />
        </button>
        <button onClick={() => handleFavorite()} className="text-xs hover:cursor-pointer" title={(fav) ? "Remove from Favorites" : "Add to Favorites"}>
            <FontAwesomeIcon icon={(fav) ? faHeartSolid : faHeart} />
        </button>
        </div>
    </div>
  );
}