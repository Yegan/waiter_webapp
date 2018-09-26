module.exports = function (pool) {

  async function daysOfTheWeek () {
    let weekDays = await pool.query('select days_of_week from days_of_the_week')
    console.log(weekDays)
    return weekDays.rows
  }

  return {
    daysOfTheWeek
  }
}
