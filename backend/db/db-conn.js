const sqlite = require('sqlite')
module.exports  = (async () => {
  const dbp = await sqlite.open(__dirname + '/restaurant.sqlite3')
  return await dbp
})();

