import * as dotenv from 'dotenv';
console.log(process.cwd());
dotenv.config({ path: `${process.cwd()}/.env` });
