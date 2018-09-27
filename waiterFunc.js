module.exports = function (pool) {
  async function daysOfTheWeek() {
    let weekDays = await pool.query('select id, days_of_week from days_of_the_week')
    return weekDays.rows
  }

  async function storeShifts(waiterName, shiftDays) {
    // found the waiter_id for the waiterName
    let waiterResults = await pool.query('select id from waiters_table where waiter_name = $1', [waiterName])

    const currentDayId = shiftDays[0]

    let dayResults = await pool.query('select id from days_of_the_week where id = $1', [currentDayId])

    const dayId = dayResults.rows[0].id
    const waiterId = waiterResults.rows[0].id

    await pool.query('insert into shift_days(days_id, waiter_id) values($1, $2)', [dayId, waiterId])
  }

  async function getShifts (waiterName) {

    /*
    let waiter = await pool.query('select id from waiters_table where waiter_name = $1')
    let days = await pool.query('select id from days_of_the_week where days_of_the_week =$1')
    let selectedShifts = await pool.query('select days_id, waiters_id from shift_days where days_id = $1 where waiters_id=$1')
    */
    const waiterShiftQuery = `select 
        waiters_table.id as waiter_id,
        waiters_table.waiter_name,
        shift_days.days_id as day_id,
        days_of_week as week_day
      from waiters_table 
        join shift_days on waiters_table.id = shift_days.waiter_id 
        join days_of_the_week on days_of_the_week.id = shift_days.days_id  
      where waiter_name = $1`

    let waiterShifts = await pool.query(waiterShiftQuery, [waiterName])
    return waiterShifts.rows

  }


  return {
    daysOfTheWeek,
    storeShifts,
    getShifts
  }
}
