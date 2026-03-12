import CatShelterController from "./controller/catshelter-controller";
import ddl from '../create-tables.sql?raw';
import db from './model/connection.ts'

// load the tables into the database 
db().exec(ddl);

new CatShelterController();


