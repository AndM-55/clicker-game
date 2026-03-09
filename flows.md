---
title: Flows of interaction for my CatClicker project
author: mouldena@myumanitoba.ca
date: Winter 2026
---

# Flows of interaction

## Create account/Sign in (Phase 2)
The user is always forced to sign in first before anything else.
here is the process for creating account and signing in, including error state.

```mermaid
flowchart
  subgraph **SIGN IN**
    sign-in[[Sign In Menu]]
    shelter-menu[[Shelter Menu]]
    retrieve-account{retrieve user info}
    create-account{create new user account}
    sign-in==Account Credentials==>retrieve-account
    sign-in==New Account Name==>create-account
    retrieve-account-.Successful login.->shelter-menu
    retrieve-account-.incorrect username or password.->sign-in
    create-account-.successfully created account.->shelter-menu
    create-account-.already an account with that name.->sign-in

  end
```

## purchase building (Phase 2)
here is the flow for purchasing a building 
```mermaid
flowchart 
  subgraph **BUILDINGS MENU**
    building-menu[[Building Menu]]
    process-choice{add building to shelter}
    shelter-menu[[Shelter Menu]]
    building-menu==chosen building==>process-choice
    process-choice-.insufficient funds.->building-menu
    process-choice-.successfully purchased building.->shelter-menu
  end
```

## shelter menu
this is the flow of interaction for the home page after a user has signed in

```mermaid
flowchart
  subgraph **SHELTER MENU**
    shelter-menu[[Shelter Menu]]
    upgrade-menu[[Upgrade Menu]]
    building-menu[[Building Menu]]
    
    cat-clicked{increase number of cats based on 'click' power}
    cat-clicked-.finished adding cats.->shelter-menu
    shelter-menu ==add cats==> cat-clicked
    shelter-menu ==purchase upgrade==>upgrade-menu
    shelter-menu==purchase building==>building-menu
  end
```

## Purchase Upgrade (updated to handle error state)

this is what it will look like to "purchase" an upgrade in the program
```mermaid
flowchart
    subgraph **UPGRADE MENU**
        upgrade-display[[Upgrade Menu]]
        upgrade-chosen{apply upgrade to shelter}
        shelter-menu[[Shelter Menu]]
        upgrade-display==chosen upgrade==>upgrade-chosen
        upgrade-chosen-.succesfully applied upgrade.->shelter-menu
        upgrade-chosen-.insufficient funds.->upgrade-display
    end
```

### changes to phase 1 diagrams
- the shelter menu diagram so it expresses how a user will purchase a building
- the purchase upgrade flow now expresses how there can be an error state when attempting to purchase 

### changes from initial phase 2 submission 
- the user is now forced to sign in or create account before anything, and after refreshes of the program. the sign in flow now includes creating an account as well.
