import { expect, test } from 'vitest';

import MultiplierUpgrade from "../src/model/multiplierupgrade.ts"
import AdderUpgrade from "../src/model/adderupgrade.ts";

test("Adder Upgrade Invariants Work", () => {
    let caught = false;
    try {
        let u = new AdderUpgrade(0);
    } catch (e: any) {
        caught = true;
    }

    expect(caught).equals(true);
});

test("Multiplier Upgrade Invariants Work", () => {
    let caught = false;
    try {
        let u = new MultiplierUpgrade(0);
    } catch (e: any) {
        caught = true;
    }

    expect(caught).equals(true);
});