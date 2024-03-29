# Projeto16_Sing_me_a_song

This project was made as a simple song recommendation service. The users can suggest more musics and vote at their favorites.

Users can also get a song recommendation or get top musics by genre.

## How to run

- Clone this repository
- Install all dependencies

```
npm i
```

- Change the file "create-tables.sql" (./database_scripts/scripts/create-tables.sql) to the desired tables names and variables
- Run on terminal: (at project's root directory)

```
 node config.js
```

This will create a production, a development and a test database and envs variables. It will also create a local user role for postgres database, if it doesn't exist.

- Edit the desired files and run server

## Commands to run

| Command                   | Action                                                                                  |
| ------------------------- | --------------------------------------------------------------------------------------- |
| npm run start             | Start server at production mode                                                         |
| npm run start:development | Start server at development mode                                                        |
| npm run start:test_driven | Start server at test driven development mode (it runs all tests each time files change) |
| npm run test              | Run all tests once                                                                      |
