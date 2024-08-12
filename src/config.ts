import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const db = open({
  filename: './src/database/tea_db.sqlite',
  driver: sqlite3.Database
});

export default db;
