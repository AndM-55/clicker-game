import { PGlite } from '@electric-sql/pglite'
import ddl from '../../create-tables.sql?raw'
import WebHash from './web-hash';
import TestHash from './test-hash';

let src = import.meta.env.VITE_DATABASE_URL

// database singleton
const pgliteDb = await PGlite.create(src) 

// similar to unique database testing, we need a unique hash function for testing 
let hashFunction = new WebHash();

// if we are running vitest, 
if (src === 'memory://') {
    db().exec(ddl);
    hashFunction = new TestHash();
}

export default function db() {
    return pgliteDb;
}

// function to retrieve the hash function implementation 
export function hash() {
    return hashFunction;
}