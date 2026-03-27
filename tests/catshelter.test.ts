import { expect, test } from 'vitest';

import MultiplierUpgrade from "../src/model/multiplierupgrade.ts"
import AdderUpgrade from "../src/model/adderupgrade.ts";
import CatShelter from "../src/model/catshelter.ts";
import LuxuriousTrap from '../src/model/luxurious-trap.ts';
import SecondhandTrap from '../src/model/secondhand-trap.ts';

test("getCatShelter correctly retrieves account error with empty database", () => {
    let success = true
    let s = new CatShelter("a", "b");
    s.cats = 400;
    CatShelter.saveCatShelter(s);

    try {
        CatShelter.getCatShelter("a", "b");
        success = true;
    } catch (e: any) {
        success = false;
    }

    expect(success).equals(true);
});

test("Can add upgrade to shelter properly", () => {
    let s = new CatShelter("a", "b");
    s.cats = 400;
    let u = new AdderUpgrade("f", "f", 10, 2, s, "hi");

    s.purchaseUpgrade(u);

    expect(s.upgrades).contains(u);
    expect(s.cats).equals(400 - 2);
});

test("Can add building to shelter properly", () => {
    let s = new CatShelter("a", "b");
    s.cats = 400;
    let b = new LuxuriousTrap("f", "f", s, 1, 2, "hi");

    s.purchaseBuilding(b);

    expect(s.buildings).contains(b);
    expect(s.cats).equals(400 - 1);
});

test("Shelter notifies listeners", () => {
    let s = new CatShelter("a", "b");
    s.cats = 400;
    let u = new AdderUpgrade("f", "f", 10, 2, s, "hi");

    let notified = false;

    s.registerListener({ notify: (() => notified = true) });

    s.purchaseUpgrade(u);

    expect(notified).equals(true);
});

test("Shelter clicks cats properly", () => {
    let s = new CatShelter("a", "b");
    s.cats = 400;
    let u = new AdderUpgrade("f", "f", 10, 2, s, "hi");
    let u2 = new MultiplierUpgrade("f", "f", 2, 2, s, "hi");

    s.purchaseUpgrade(u);
    s.purchaseUpgrade(u2);
    s.cats = 0;
    s.clickCat();

    let click = 1
    click = u.applyEffect(click);
    click = u2.applyEffect(click);

    expect(s.cats).equals(click);
});
