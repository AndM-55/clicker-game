---
title: Domain model for my CatCLicker project
author: mouldena@myumanitoba.ca
date: Winter 2026
---

# Domain model

```mermaid
classDiagram

    class Profile {
        -~string Username
        -CatShelter shelter
    }
    Profile "1" o--* "1" CatShelter

    class CatShelter {
        -number Id
        -Profile profile
        -number cats
        -Array~Upgrade~ clickUpgrades
        -Array~Building~ buildings

        +clickCat() void
        +purchaseUpgrade(Upgrade upgrade) void
        +purchaseBuilding(Building building) void
    }
    note for CatShelter "Invariant properties:
    <ul>
        <li>cats >= 0
    </ul>"
    CatShelter "1" o--* "*" Upgrade
    CatShelter "1" o--* "*" Building

    class Building {
        <<INTERFACE>>
        -number Id
        -CatShelter shelter
        +harvestCats() 
    }

    class SecondhandCageTrap {
        -number catsPerSecond
        -string description
        -number price
        +harvestCats() 

    }
    SecondhandCageTrap --|> Building
    note for SecondhandCageTrap "Invariant properties:
    <ul>
        <li> catsPerSecond >= 1
    </ul>"

    class LuxuriousCageTrap {
        -number catsPerSecond
        -string description
        -number price
        +harvestCats() 
    }
    note for LuxuriousCageTrap "Invariant properties:
    <ul>
        <li> catsPerSecond >= 1
    </ul>"
    LuxuriousCageTrap --|> Building

    class Upgrade {
        <<INTERFACE>>
        -number Id
        -CatShelter shelter
        +applyEffect(number currPower) number
        
    }

    class ClickMultUpgrade {
        -number multiplier
        -number price
        -string description
        +applyEffect(number currPower) number
    }
    note for ClickMultUpgrade "Invariant properties:
    <ul>
        <li> multiplier > 1
    </ul>"
    ClickMultUpgrade --|> Upgrade

    class ClickAddUpgrade {
        -number addend
        -number price
        -string description
        +applyEffect(number currPower) number
    }
    note for ClickAddUpgrade "Invariant properties:
    <ul>
        <li> addend >= 1
    </ul>"
    ClickAddUpgrade --|> Upgrade
```
### updates:
- another class, ProfileSelect, has been created to hold onto all profiles in the application. it is composed of CatShelters, which function as accounts
- CatShelter has been given a property "shelterOwner" to help distinguish between users 
- another interface, "building", has been added; implemented by 2 new classes, the cage traps
- both implementations of "upgrade" have been given aggregate references to their shelters 
- catShelters get an array of buildings and a method to purchase new buildings
- All upgrades and buildings have meaningful descriptions as properties

### pending changes
- instead of having a domain model object that holds all user profiles, we should just have a domain model object that represents a single profile. let the database control which cat shelter belongs to each profile. with this change we dont need a "shelterOwner" property on the catshelter, instead, profile will have a name. The catShelter will keep a synthetic ID, and profile will have a natural key


- building and upgrade will be given synthetic ID's in the interface specification. the back references will be put there as well
