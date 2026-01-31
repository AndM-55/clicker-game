import { expect, test } from 'vitest';

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