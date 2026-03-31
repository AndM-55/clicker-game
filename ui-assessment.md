---
title: Cat-clicker UI assessment
author: Andrew Moulden, mouldena@myumanitoba.ca
date: Winter 2026
---
# phase 1 
here is the entire UI for phase 1 as it was submitted. it looks terrible, but.. 
![phase 1 UI](../2452-clicker/screenshots/phase-1.png)

### Phase 1 visibility
overall the visibility of the user interface for phase 1 is acceptable
- +1 all possible actions the user can do are visible to the user at all times. 
- +1 there are no 'sometimes possible' actions being hidden from the user
- +1 the system always adequately displays what state it's in, and the user should not be confused about where they are
- -1 before anything is purchased, the empty upgrades list is hidden from the user which may lead to confusion
### Phase 1 feedback
overall the feedback for the phase 1 user interface is good
- +1 when any of the buttons are pressed, the system immediately updates the display to tell the user that something has happened
![phase1 upgrades](../2452-clicker/screenshots/phase1-cats-upgrades.png) 

### Phase 1 consistency
overall the consistency of the pase 1 user interface is good
- +1 all buttons in the app have appropriate labels with verbs to help describe their purpose
- +1 all flows of interaction for similar tasks are consistent with eachother 
# phase 2
here is the major new part of my UI for phase 2
![The log in screen.](../2452-clicker/screenshots/phase-2-login.png)

here is the main UI for phase 2
![the main UI](../2452-clicker/screenshots/phase-2-mainUI.png)

### changes from phase 1
- upgrades now display their price and description when their purchase button is moused over
- lists of upgrades and buildings are displayed whether the list is empty or not  
- errors when attempting to purchase an upgrade using insufficient funds

### Phase 2 visibility
overall visibility of the phase 2 UI is good 
- +1 all possible actions are always visible for the user
- +1 all 'sometimes possible' actions are still visible, but through communicating errors to the user, they are 'disabled'
- +1 the user always knows what state the system is in given the information on the screen


### phase 2 feedback 
overall the feedback for the phase 2 UI is acceptable
- +1 when the system does something, it communicates to the user that something has happened 
- +1 if an error has happened, it communicates to the user what action should be taken to resolve the error
- -1 in once instance, the error message doesnt guide the user, or specify a solution.
- logging in with bad credentials (not a good error message)
![bad login](../2452-clicker/screenshots/bad-login.png)
- creating account with invalid password (good)
![invalid pass](../2452-clicker/screenshots/invalid-pass.png)
- creating account with invalid username (good)
![invalid user](../2452-clicker/screenshots/invalis-username.png)
- creating account with a taken username (good)
![duplicate name](../2452-clicker/screenshots/username-taken.png)
- purchase upgrade with insufficient funds (good)
![insufficient funds](../2452-clicker/screenshots/insufficient-funds.png)
- mouseover upgrade (good)
![upgrade def](../2452-clicker/screenshots/upgrade-info.png)
- purchase upgrades and cats (good)
![purchase things](../2452-clicker/screenshots/cats-and-upgrades.png)


### phase 2 consistency
overall the consistency of phase 2 UI is good
- +1 all buttons have descriptive labels with verbs 
- +1 all input fields have adequate labels to define them 
- +1 the login/create account operations both flow in a similar fashion. all upgrade/building purchases and error messages flow in a similar fashion. all upgrade description popups flow in a similar fashion.

## how I might change the UI 
- I would add pictures to appropriate buttons to make them easier to tell apart and identify their unique purposes 
- I would revise any incomplete error messages
- I would make some general revisions to the overall style of the UI, i.e., make the list of upgrades/buildings easier to read.
