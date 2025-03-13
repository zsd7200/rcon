import sqlite3 from "sqlite3";
import { getPath } from "@/db/Path";
import { ServersRow, CommandsRow, HistoryRow } from "@/db/RowTypes";

const path = getPath();
const db = new sqlite3.Database(
  path,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err: Error | null) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to server database.');
  }
);
db.get("PRAGMA foreign_keys = ON");

const dbGet = async (query: string) => {
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

export { db, dbGet, dbPost };