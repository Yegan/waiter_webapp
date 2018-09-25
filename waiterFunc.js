module.exports = function (pool) {
  async function daysOfTheWeek () {
    let weekDays = pool.query('select * from days_of_the_week')
    return weekDays
  }

  return {
    daysOfTheWeek
  }
}
