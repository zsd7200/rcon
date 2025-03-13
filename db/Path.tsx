import path from "path";
import fs from "fs";

export function getPath() {
  return path.join(process.cwd(), 'servers.db');
}

export function dbFileCheck() {
  const path = getPath();

  return new Promise((resolve) => {
    fs.stat(path, (err, stats) => {
      if (err || stats.size == 0) return resolve(false);
      return resolve(true);
    });
  });

}