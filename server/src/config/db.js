const Pool = require("pg").Pool;

const pool = new Pool({
  // connectionString: process.env.DATABASE_URL,
  connectionString: process.env.DATABASE_EXT_URL,
  ssl: {
    rejectUnauthorized: false, 
  },
});


module.exports = pool;
