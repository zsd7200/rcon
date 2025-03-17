'use server';

import { dbConnect } from "@/db/Database";

export const migrate = async () => {
  const db = await dbConnect();
  db.serialize(() => {
   db.run(
    `
      CREATE TABLE IF NOT EXISTS servers (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT NOT NULL,
        host        TEXT NOT NULL,
        port        INTEGER NOT NULL,
        password    TEXT NOT NULL
      );
    `,
    (err: Error) => {
     if (err) {
      console.error(err.message);
     }
     console.log('servers table migration run successfully.');
    }
   );
   db.run(
    `
      CREATE TABLE IF NOT EXISTS favorites (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id   INTEGER NOT NULL,
        name        TEXT NOT NULL,
        command     TEXT NOT NULL,
        FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
      );
    `,
    (err: Error) => {
     if (err) {
      console.error(err.message);
     }
     console.log('favorites table migration run successfully.');
    }
   );
   db.run(
    `
      CREATE TABLE IF NOT EXISTS history (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id   INTEGER NOT NULL,
        command     TEXT NOT NULL,
        response    TEXT NOT NULL,
        time        DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
      );
    `,
    (err: Error) => {
     if (err) {
      console.error(err.message);
     }
     console.log('history table migration run successfully.');
    }
   );
   db.run(
    `
      CREATE TABLE IF NOT EXISTS alias (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id   INTEGER,
        command     TEXT NOT NULL,
        alias       TEXT NOT NULL,
        FOREIGN KEY (server_id) REFERENCES servers(id) ON DELETE CASCADE
      );
    `,
    (err: Error) => {
     if (err) {
      console.error(err.message);
     }
     console.log('alias table migration run successfully.');
    }
   );
  });
}