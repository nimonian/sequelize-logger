async function logTable (Table) {
  const allData = await Table.findAll()
  console.table(allData.map(row => row.toJSON()))
}

module.exports = { logTable }
