---
title: Domain model for my CatCLicker project
author: mouldena@myumanitoba.ca
date: Winter 2026
---

# Domain model

```mermaid
classDiagram

    class CatShelter {
        -~string accountName
        -string password
        -number cats
        -Array~Upgrade~ clickUpgrades
        -Array~Building~ buildings

        +clickCat() void
        +checkTraps() void
        +purchaseUpgrade(Upgrade upgrade) void
        +purchaseBuilding(Building building) void
    }
    note for CatShelter "Invariant properties:
    <ul>
        <li>cats >= 0
        <li>accountName.length > 0
        <li>password.length > 0
    </ul>"
    CatShelter "1" o--* "*" Upgrade
    CatShelter "1" o--* "*" Building

    class Building {
        <<INTERFACE>>
        -~number Id
        -CatShelter shelter
        -string description
        -number price
        -number catsPerSecond
        +harvestCats() 
    }

    class SecondhandCageTrap {
        
        +harvestCats() 

    }
    SecondhandCageTrap --|> Building
    note for SecondhandCageTrap "Invariant properties:
    <ul>
        <li> catsPerSecond >= 1
        <li> price > 0
    </ul>"

    class LuxuriousCageTrap {
        +harvestCats() 
    }
    note for LuxuriousCageTrap "Invariant properties:
    <ul>
        <li> catsPerSecond >= 1
        <li> price > 0
    </ul>"
    LuxuriousCageTrap --|> Building

    class Upgrade {
        <<INTERFACE>>
        -~number Id
        -CatShelter shelter
        -number price
        -string description
        +applyEffect(number currPower) number
        
    }

    class ClickMultUpgrade {
        -number multiplier
        
        +applyEffect(number currPower) number
    }
    note for ClickMultUpgrade "Invariant properties:
    <ul>
        <li> multiplier > 1
        <li> price > 0
    </ul>"
    ClickMultUpgrade --|> Upgrade

    class ClickAddUpgrade {
        -number addend
        +applyEffect(number currPower) number
    }
    note for ClickAddUpgrade "Invariant properties:
    <ul>
        <li> addend >= 1
        <li> price > 0
    </ul>"
    ClickAddUpgrade --|> Upgrade
```
### updates:
- CatShelter has been given the properties: accountName and password so it can function as a profile
- another interface, "building", has been added; implemented by 2 new classes, the cage traps
- both implementations of "upgrade" have been given aggregate references to their shelters 
- catShelters get an array of buildings and a method to purchase new buildings
- All upgrades and buildings have meaningful descriptions as properties, as well as serial ID's to identify them as unique instances

##### NOTE: as per a conversation I had with Franklin, I decided to delete the profileSelect as its own class, and I made it so that catShelter has profile functionality as an alternative. We discussed that yes, it isnt very cohesive, but it makes the database easier to manage, and should I ever need to extract the concept of profile out of this class, it wouldnt be that difficult.
