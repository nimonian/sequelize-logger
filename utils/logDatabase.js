const { logTable } = require('./logTable')

async function logDatabase (db) {
  for (let Table of Object.values(db.models)) {
    logTable(Table)
  }
}

module.exports = { logDatabase }
