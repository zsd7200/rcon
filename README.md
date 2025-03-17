# RCON Web GUI

A Web GUI to interface with RCON game servers. 

Allows users to add multiple RCON servers and send commands. Displays responses, keeps a history of commands, and allows adding commands as favorites.

WIP.

## Getting Started
Create a `.env` with the following entries:

```
CRYPTO_KEY=
CRYPTO_SALT=
```

Both `CRYPTO_KEY` and `CRYPTO_SALT` should be randomly generated strings.

If none are provided, the console will log two UUIDs. 

It is recommended to save these to your `.env` file and restart the application.

Then, run install command:

```bash
npm i
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:25545](http://localhost:25545) with your browser to see the result.
