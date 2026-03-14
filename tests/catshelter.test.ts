import { expect, test } from 'vitest';

import MultiplierUpgrade from "../src/model/multiplierupgrade.ts"
import AdderUpgrade from "../src/model/adderupgrade.ts";
import CatShelter from "../src/model/catshelter.ts";

test("Can add upgrade to shelter", () => {
    let s = new CatShelter("a", "b");
    let u = new AdderUpgrade(10, 0, s);

    s.purchaseUpgrade(u);

    expect(s.upgrades).contains(u);
});

test("Shelter notifies listeners", () => {
    let s = new CatShelter("a", "b");
    let u = new AdderUpgrade(10, 0, s);

    let notified = false;

    s.registerListener({ notify: ( () => notified = true )});

    s.purchaseUpgrade(u);

    expect(notified).equals(true);
});

test("Shelter adds cats properly", () => {
    let s = new CatShelter("a", "b");
    let u = new AdderUpgrade(10, 0, s);
    let u2 = new MultiplierUpgrade(2, 0, s);

    s.purchaseUpgrade(u);
    s.purchaseUpgrade(u2);
    s.clickCat();

    let click = 1
    click = u.applyEffect(click);
    click = u2.applyEffect(click);

    expect(s.cats).equals(click);
});