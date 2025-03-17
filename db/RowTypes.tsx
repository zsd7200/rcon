export type ServersRow = {
  id?: number,
  name: string,
  host: string,
  port: string,
  password: string,
}

export type FavoritesRow = {
  id?: number,
  server_id: string,
  name: string,
  command: string,
}

export type HistoryRow = {
  id?: number,
  server_id: string,
  command: string,
  response: string,
  time?: string,
}

export type AliasRow = {
  id?: number,
  server_id?: string,
  command: string,
  alias: string,
}