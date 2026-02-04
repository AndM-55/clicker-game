import { expect, test } from 'vitest';

import MultiplierUpgrade from "../src/model/multiplierupgrade.ts"
import AdderUpgrade from "../src/model/adderupgrade.ts";
import CatShelter from "../src/model/catshelter.ts";

test("Can add upgrade to shelter", () => {
    let u = new AdderUpgrade(10);
    let s = new CatShelter();

    s.purchaseUpgrade(u);

    expect(s.upgrades).contains(u);
});

test("Shelter notifies listeners", () => {
    let u = new AdderUpgrade(10);
    let s = new CatShelter();

    let notified = false;

    s.registerListener({ notify: ( () => notified = true )});

    s.purchaseUpgrade(u);

    expect(notified).equals(true);
});

test("Shelter adds cats properly", () => {
    let u = new AdderUpgrade(10);
    let u2 = new MultiplierUpgrade(2);
    let s = new CatShelter();

    s.purchaseUpgrade(u);
    s.purchaseUpgrade(u2);
    s.clickCat();

    let click = 1
    click = u.applyEffect(click);
    click = u2.applyEffect(click);

    expect(s.cats).equals(click);
});