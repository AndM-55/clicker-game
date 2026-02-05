---
title: CatClicker2452
author: Andrew Moulden (mouldena@myumanitoba.ca)
date: Winter 2026
---
# overview
CatClicker2452 is an idle clicker game inspired by cookie clicker, for COMP 2452 winter 2026. Instead of clicking cookies, the user clicks cats to adopt them into the 'cat shelter'
* the user can click a button to adopt cats
* the user can 'purchase' upgrades to increase the number of cats gained per click

The program uses an MVC software architecture. 
* All domain model objects can be found in the 'model' folder
* All controller ts files can be found in the 'csontroller' folder
* All User Interface ts/html files can be found in the 'view' folder
# Running
This project is a Node.js project that uses Vite.
You can start my app using `npm` and `npx`:

```bash
npm install
npx vite
```
after running the command, click the link that appears in the console to be brought to the local webpage to interact with the program

# Testing
to test with coverage, I ran this command
```bash
npx vitest run --coverage
```

# Other docs

* You can find my domain model in `domain.md`.
* You can find my flows of interaction in `flows.md`.
