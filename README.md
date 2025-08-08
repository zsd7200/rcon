# RCON Web GUI

A Web GUI to interface with RCON game servers. Developed for Minecraft, but should work with other games with RCON servers.

Allows users to add multiple RCON servers and send commands. Displays responses, keeps a history of commands, and allows adding commands as favorites.

WIP.

## Getting Started

### With Docker + docker-compose.yml (recommended)
1. Clone this repository.

```bash
git clone https://github.com/zsd7200/rcon.git
```

2. Make a copy of `docker-compose.yml.example` and rename it to simply `docker-compose.yml`.
3. Set both `CRYPTO_KEY` and `CRYPTO_SALT` to random strings (wrapped in `""`).
    - If none are provided, the console (`docker logs rcon-web-gui`) will log two UUIDs.
    - It is recommended to save these to your `docker-compose.yml` file and recreate the container (`docker compose up -d`).
4. Navigate to this repository's directory and run (may take some time on first run):
```bash
docker compose up -d
```
6. Open [http://localhost:25545](http://localhost:25545) with your browser to see the result.

### Without Docker
1. Create a `.env` with the following entries:

```
CRYPTO_KEY=
CRYPTO_SALT=
```

2. Both `CRYPTO_KEY` and `CRYPTO_SALT` should be randomly generated strings.
    - If none are provided, the console will log two UUIDs. 
    - It is recommended to save these to your `.env` file and restart the application.

3. Run install command:

```bash
npm i
```

4. Build the server:

```bash
npm run build
```

5. Run the server:

```bash
npm run start
```

6. Open [http://localhost:25545](http://localhost:25545) with your browser to see the result.

## Troubleshooting

**Q: I'm getting the following error message: `Error connecting to server via RCON. Error code: ENOTFOUND`**

A: The host is not currently hosting a Minecraft server. 
Try adding the server again and double-checking that the information is right.

**Q: I'm getting the following error message: `Error connecting to server via RCON. Error code: ECONNREFUSED`**

A: The host's RCON port is not accessible. Is your port forwarded?

**Q: When going to my server page, it takes way too long to send the first command.`**

A: You may have entered the server's port rather than the RCON port (or a different incorrect port).
Try adding the server again and double-checking that the port entered is the RCON port and not the server port.

If you experience any other issues, please create an issue on this repository and I will see what I can do.
