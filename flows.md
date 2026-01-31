---
title: Flows of interaction for my CatClicker project
author: mouldena@myumanitoba.ca
date: Winter 2026
---

# Flows of interaction

## Shelter menu

When the program starts, the user is first brought to the 'cat clicking' interface. 

```mermaid
flowchart
  subgraph **SHELTER MENU**
    shelter-menu[[Shelter Menu]]
    upgrade-menu[[Upgrade Menu]]
    cat-clicked{increase number of cats based on 'click' power}
    cat-clicked-.finished adding cats.->shelter-menu
    shelter-menu ==add cats==> cat-clicked
    shelter-menu ==purchase upgrade==>upgrade-menu
  end
```

## Purchase Upgrade

this is what it will look like to "purchase" an upgrade in the program
```mermaid
flowchart
    subgraph **UPGRADE MENU**
        upgrade-display[[Upgrade Menu]]
        upgrade-chosen{apply upgrade to shelter}
        shelter-menu[[Shelter Menu]]
        upgrade-display==chosen upgrade==>upgrade-chosen
        upgrade-chosen-.succesfully applied upgrade.->shelter-menu

    end
```