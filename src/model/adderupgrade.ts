import { assert } from '../assertions.ts';
import type CatShelter from './catshelter.ts';
import type Upgrade from './upgrade.ts';
import db from './connection.ts';
import MultiplierUpgrade from './multiplierupgrade.ts';

/**
 * An additive upgrade that adds to the power of the user's click
 */
export default class AdderUpgrade {
  id?: number
  shelter: CatShelter;
  descriptor: string;
  price: number;
  #addend: number;

  constructor(addend: number, price: number, shelter: CatShelter, descriptor: string) {
    this.shelter = shelter;
    this.#addend = addend;
    this.price = price
    this.descriptor = descriptor;
    if (this.#addend < 1) {
      throw new InvalidAddendException();
    }
    this.#checkAdderUpgrade();
  }

  #checkAdderUpgrade() {
    assert(this.#addend >= 1, "Addend must be at least 1");
    assert(this.price > 0, "price must be greater than 0");
  }

  /**
   * this function persists an upgrade to the database
   * 
   * @param upgrade upgrade to be saved to the database
   * @returns the same upgrade that was saved
   */
  static async saveUpgrade(upgrade: Upgrade): Promise<Upgrade> {
    let type 
    if (upgrade instanceof AdderUpgrade) {
      type = "addclick";
    } else {
      type = "multclick";
    }

    let results = await db().query<{ id: number }>("insert into upgrade(id, strength, price, descriptor, upgradeType, shelter) values(default, $1, $2, $3, $4, $5) returning id",
      [upgrade.power, upgrade.price, upgrade.descriptor, type, upgrade.shelter.username]);

    let row = results.rows[0];
    upgrade.id = row.id;
    console.log(`Upgrade got id ${upgrade.id}`);
    return upgrade;
  }

  /**
   * this function gets a collection of {@link Upgrade } that belongs to a {@link CatShelter} in the database
   * this function also retrieves any upgrades of the implementation type {@link MultiplierUpgrade}
   * 
   * @param shelter the {@link CatShelter} that we want to retrieve the {@link Upgrade} for
   * @returns promise of an array of {@link Upgrade}
   */
  static async getUpgradesForShelter(shelter: CatShelter): Promise<Array<Upgrade>> {
    let results = await db().query<{

      id: number
      strength: number
      price: number
      descriptor: string
      upgradetype: string
      shelter: string

    }>("select id, strength, price, descriptor, upgradetype, shelter from upgrade where shelter = $1",
      [shelter.username]);

    let allUpgrades = new Array<Upgrade>;

    results.rows.forEach(row => {
      let u;
      if (row.upgradetype === "addclick") {
        u = new AdderUpgrade(row.strength, row.price, shelter, row.descriptor);
      } else {
        u = new MultiplierUpgrade(row.strength, row.price, shelter, row.descriptor);
      }
      u.id = row.id;
      allUpgrades.push(u)
    })

    return allUpgrades;
  }

  applyEffect(base: number): number {
    this.#checkAdderUpgrade();
    return base + this.#addend;
  }

  get power() {
    return this.#addend;
  }
}

// custom exception for invalid addend property
export class InvalidAddendException extends Error { }