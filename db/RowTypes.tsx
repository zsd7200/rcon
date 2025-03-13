export type ServersRow = {
  id?: number,
  name: string,
  host: string,
  port: string,
}

export type CommandsRow = {
  id?: number,
  server_id: string,
  name: string,
  command: string,
}

export type HistoryRow = {
  id?: number,
  server_id: string,
  command: string,
  time?: string,
}