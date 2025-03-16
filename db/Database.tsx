'use server';

import sqlite3 from "sqlite3";
import path from "node:path";
import { ServersRow, CommandsRow, HistoryRow } from "@/db/RowTypes";

const dbConnect = async () => {
  const filePath = path.join(process.cwd(), 'servers.db');
  const db = new sqlite3.Database(
    filePath,
    sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
    (err: Error | null) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to server database.');
    }
  );
  db.get("PRAGMA foreign_keys = ON");
  return db;
}

const dbGet = async (query: string) => {
  const db = await dbConnect();
  return await new Promise((resolve, reject) => {
    db.all(query, (err: Error, row: Array<ServersRow | CommandsRow | HistoryRow>) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      return resolve(row);
    })
  });
};

const dbPost = async (query: string, values: Array<string>) => {
  const db = await dbConnect();
  return await new Promise((resolve, reject) => {
    db.run(query, values, (err: Error) => {
      if (err) {
        console.error(err);
        return reject(err);
      }
      return resolve(null);
    })
  });
};

export { dbConnect, dbGet, dbPost };