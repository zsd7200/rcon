'use server';

import { dbGet } from '@/db/Database';
import { FavoritesRow, HistoryRow } from '@/db/RowTypes';

export const getFavoritesList = async (serverId: number) => {
    const query = `
        SELECT * from favorites
        WHERE server_id=${serverId}
    `;
    try {
        const data: Array<FavoritesRow> = await dbGet(query) as Array<FavoritesRow>;
        return data;
    } catch (e) {
        const err = e as Error;
        return err.message;
    }
}

export const getHistoryList = async (serverId: number) => {
    const query = `
        SELECT * from history
        WHERE server_id=${serverId}
    `;
    try {
        const data: Array<HistoryRow> = await dbGet(query) as Array<HistoryRow>;
        const reversedData: Array<HistoryRow> = data.reverse(); // need to reverse because API sends it in opposite order of what we want
        return reversedData;
    } catch (e) {
        const err = e as Error;
        return err.message;
    }
}