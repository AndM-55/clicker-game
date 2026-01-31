---
title: Domain model for my CatCLicker project
author: mouldena@myumanitoba.ca
date: Winter 2026
---

# Domain model

```mermaid
classDiagram
    class CatShelter {
        -number cats
        -Array~Upgrade~ upgrades

        +clickCat() void
        +purchaseUpgrade(Upgrade upgrade) void
    }
    note for CatShelter "Invariant properties:
    <ul>
        <li>cats >= 0
    </ul>"
    CatShelter --* Upgrade

    class Upgrade {
        <<INTERFACE>>
        +applyEffect(number currPower) number
    }

    class MultiplierUpgrade {
        -number multiplier
        +applyEffect(number currPower) number
    }
    note for MultiplierUpgrade "Invariant properties:
    <ul>
        <li> multiplier >= 1
    </ul>"
    MultiplierUpgrade --|> Upgrade

    class AdderUpgrade {
        -number addend
        +applyEffect(number currPower) number
    }
    note for AdderUpgrade "Invariant properties:
    <ul>
        <li> addend >= 1
    </ul>"
    AdderUpgrade --|> Upgrade
```
### updates:
##### changed CatShelter to not have properties for click power, but instead the number of cats gained will be calculated in the clickCat method by looking at each upgrade every time it's clicked 