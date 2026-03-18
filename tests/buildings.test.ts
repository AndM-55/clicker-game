import { expect, test } from 'vitest';
import CatShelter from '../src/model/catshelter';
import LuxuriousTrap from '../src/model/luxurious-trap';
import SecondhandTrap from '../src/model/secondhand-trap';

test("Luxurious trap invariants work", () => {
    let caught = false;
        try {
            let s = new CatShelter("a", "b");
                s.cats = 400;
            let u = new LuxuriousTrap(s, 0, 2, "hi");
        } catch (e: any) {
            caught = true;
        }
    
        expect(caught).equals(true);
});

test("Secondhand trap invariants work", () => {
    let caught = false;
        try {
            let s = new CatShelter("a", "b");
                s.cats = 400;
            let u = new SecondhandTrap(s, 0, 2, "hi");
        } catch (e: any) {
            caught = true;
        }
    
        expect(caught).equals(true);
});

