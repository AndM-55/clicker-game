---
title: Flows of interaction for my CatClicker project
author: mouldena@myumanitoba.ca
date: Winter 2026
---

# Flows of interaction

## Shelter menu (updated for multi user functionality)

When the program starts, the user is first brought to the 'cat clicking' interface. 

```mermaid
flowchart
  subgraph **SHELTER MENU**
    shelter-menu[[Shelter Menu]]
    upgrade-menu[[Upgrade Menu]]
    building-menu[[Building Menu]]
    sign-in[[Sign In Menu]]
    cat-clicked{increase number of cats based on 'click' power}
    cat-clicked-.finished adding cats.->shelter-menu
    shelter-menu ==add cats==> cat-clicked
    shelter-menu ==purchase upgrade==>upgrade-menu
    shelter-menu==purchase building==>building-menu
    shelter-menu==log out==>sign-in
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


## Create account/Sign in (Phase 2)
here is the process for creating account and signing in

```mermaid
flowchart
  subgraph **SIGN IN**
    sign-in[[Sign In Menu]]
    shelter-menu[[User's Shelter Menu]]
    retrieve-account{retrieve user info}
    sign-in==Chosen Account==>retrieve-account
    retrieve-account-.Successful login.->shelter-menu

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

### changes 
after phase 1, i changed a few things from the phase 1 diagrams
-  the shelter menu diagram so it expresses how a user will log out and purchase a building
-  the purchase upgrade flow now expresses how there can be an error state when attempting to purchase 