import { db } from "@/db/Database";

export const migrate = () => {
  db.serialize(() => {
   db.run(
    `
      CREATE TABLE IF NOT EXISTS servers (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        name        TEXT NOT NULL,
        host        TEXT NOT NULL,
        port        INTEGER NOT NULL
      );
    `,
    (err: Error) => {
     if (err) {
      console.error(err.message);
     }
     console.log("servers table created successfully.");
    }
   );
   db.run(
    `
      CREATE TABLE IF NOT EXISTS commands (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id   INTEGER NOT NULL,
        name        TEXT NOT NULL,
        command     TEXT NOT NULL,
        FOREIGN KEY (server_id) REFERENCES servers(id)
      );
    `,
    (err: Error) => {
     if (err) {
      console.error(err.message);
     }
     console.log("commands table created successfully.");
    }
   );
   db.run(
    `
      CREATE TABLE IF NOT EXISTS history (
        id          INTEGER PRIMARY KEY AUTOINCREMENT,
        server_id   INTEGER NOT NULL,
        command     TEXT NOT NULL,
        time        DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (server_id) REFERENCES servers(id)
      );
    `,
    (err: Error) => {
     if (err) {
      console.error(err.message);
     }
     console.log("history table created successfully.");
    }
   );
  });
}