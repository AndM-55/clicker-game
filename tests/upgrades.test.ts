import { expect, test } from 'vitest';

import MultiplierUpgrade from "../src/model/multiplierupgrade.ts"
import AdderUpgrade from "../src/model/adderupgrade.ts";
import CatShelter from '../src/model/catshelter.ts';

test("Adder Upgrade Invariants Work", () => {
    let caught = false;
    try {
        let s = new CatShelter("a", "b");
            s.cats = 400;
        let u = new AdderUpgrade(0, 1, s, "hi");
    } catch (e: any) {
        caught = true;
    }

    expect(caught).equals(true);
});

test("Multiplier Upgrade Invariants Work", () => {
    let caught = false;
    try {
        let s = new CatShelter("a", "b");
            s.cats = 400;
        let u = new MultiplierUpgrade(0, 1, s, "hi");
    } catch (e: any) {
        caught = true;
    }

    expect(caught).equals(true);
});