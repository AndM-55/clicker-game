import { PGlite } from '@electric-sql/pglite'

// this says to use index DB as the backing storage for PGlite
// this is "permanent" storage for us in the web browsr
const pgliteDb = await PGlite.create('idb://2452-clicker') 

export default function db() {
    return pgliteDb;
}