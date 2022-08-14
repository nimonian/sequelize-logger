/**
 * If you wish to run the example, you must install sqlite3 first:
 * npm i sqlite3
 */

const { Sequelize, DataTypes } = require('sequelize')
const {
  logTable,
  logTables,
  logAllTables,
  logQuery
} = require('./index')

// initialise the database
const db = new Sequelize({
  storage: ':memory:',
  dialect: 'sqlite',
  logging: false
})

// create some models
const Character = db.define('Character', {
  name: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER }
})

const Race = db.define('Race', {
  name: { type: DataTypes.STRING }
})

// define some associations
Race.belongsToMany(Character, { through: 'Character_Race' })
Character.belongsToMany(Race, { through: 'Character_Race' })

async function test () {
  // reset the database and initialise associations
  await db.sync({ force: true })

  // some mock data
  const legolas = await Character.create({ name: 'Legolas', age: 150 })
  const frodo = await Character.create({ name: 'Frodo', age: 30 })
  const hobbits = await Race.create({ name: 'Hobbits' })
  const elves =  await Race.create({ name: 'Elves' })
  await frodo.addRace(hobbits)
  await elves.addCharacter(legolas)

  /**
   * logTable
   */

  // Pass in a model and its table will be logged
  await logTable(Character)
  // If model name is used, sequelize instance must be passed
  // If this is omitted, a warning will be logged
  await logTable('Race', db)
  // You generally don't have the junction table model at hand, but it can be
  // logged like so:
  await logTable(db.models.Character_Race)

  /**
   * logTables
   */
  
  // Can log the tables for multiple models
  await logTables(Character, Race)
  // If any model is given by its name, sequelize instance must be passed
  await logTables('Character', Race, db)

  /**
   * logAllTables
   */

  // All tables associated with the instance are logged
  // This includes junction tables
  await logAllTables(db)

  /**
   * logQuery
   */

  // Can handle single entry returns as well as arrays
  await logQuery(Character.findOne())
  // Optional text appears above log, otherwise a timestamp
  await logQuery(Character.findAll(), { text: 'All characters' })
  // Table can't deal with nested objects so it can be turned off
  await logQuery(Race.findOne({ include: Character }), { table: false })

}

test()
