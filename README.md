---
title: CatClicker2452
author: Andrew Moulden (mouldena@myumanitoba.ca)
date: Winter 2026
---
## notable things for phase 3 implementation
* YOU MUST PUCHASE AT LEAST ONE THING FOR AUTO BUY TO FUNCTION, THIS IS INTENDED (in the future I would like to implement some UI feedback that makes this clear to the user)
* when you create a new account, I have made it so you start with 500 currency, so that you don't have to click so much to assess the program. you can get straight to buying 1 item then assessing auto-buy
* within main, an instance of the training model is created, as well as a function that effectively allows this instance to be used as a singleton. the CatShelter class uses the training data singleton to do all the markov chain responsibilities. The 3 CatShelter classes that deal with the markov chain are: `autoBuy`, `initializeChain`, and `#nextSymbol` located below the constructor

## changes from phase 2 initial submission 
* catshelter-controller is now significantly shorter with only 2 purchase methods. one for the building interface, one for the Upgrade interface
* cat-shelter-view has some responsibility for creating instances in that the buttons decide which inventory instances are going to be added to the account. It still doesn't call constructors.
* autoclick is now a responsibility of the view class, but it still communicates with the model through the controller
* the controller no longer makes decisions about database results, the database makes these decisions and the controller only reacts to the exceptions appropriately
* the controller does not create item description views anymore, this responsibility was given to the cat-shelter-view directly
* I fixed the ddl deffault insert so now you should be able to purchase upgrades and buildings. I had originally forgotten to uncomment them by accident... and I didn't consider that my own database information is not included in the submission folder, so you definitely needed those statements to not be commented out

# overview
CatClicker2452 is an idle clicker game inspired by cookie clicker, for COMP 2452 winter 2026. Instead of clicking cookies, the user clicks cats to adopt them into the 'cat shelter'
* the user can click a button to adopt cats
* the user can 'purchase' upgrades to increase the number of cats gained per click
* the user can purchase buildings to auto click for them
* once obtaining one purchasable, the user can activate auto buy to automatically buy more upgrades and buildings

The program uses an MVC software architecture. 
* All domain model ts files can be found in the 'model' folder
* All controller ts files can be found in the 'controller' folder
* All User Interface ts/html files can be found in the 'view' folder
# Training 
to train the model, I processed "training.csv" with "markovtraining/training.ts", located in the root of the project folder. to run training.ts, I used `npm`, `npx` and `tsx`:
```bash
npm install
npx tsx markovtraining/training.ts
```
### output
the output is stored in "output.csv" which is located in the root of the project folder. This file contains 10 rows of comma separated array values.

- this file contains the raw probabilities of each entry in the adjacency matrix 


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
* you can find my DDL in `create-tables.sql`
* you can find my training output in `output.csv`
