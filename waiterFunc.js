module.exports = function (pool) {
  async function daysOfTheWeek () {
    let weekDays = await pool.query('select * from days_of_the_week')
    return weekDays.rows
  }

  async function addWaiterName (name) {
    let nameOfWaiter = await pool.query('select * from waiters_table where waiter_name =$1', [name])

    let getWaiter = nameOfWaiter.rowCount
    if (getWaiter === 0) {
      await pool.query('insert into waiters_table(waiter_name) values($1)', [name])
    }
  }

  async function checksWaiterName () {
    let waiters = await pool.query('select waiter_name from waiters_table')
    return waiters.rows
  }

  async function storeShifts (waiterName, shiftDays) {
    // found the waiter_id for the waiterName
    let days = daysOfTheWeek()
    let waiterResults = await pool.query('select id from waiters_table where waiter_name = $1', [waiterName])

    let dayResults = await pool.query('select id from days_of_the_week where id = $1', [currentDayId])

    const dayId = dayResults.rows[0].id
    const waiterId = waiterResults.rows[0].id

    await pool.query('insert into shift_days(days_id, waiter_id) values($1, $2)', [dayId, waiterId])
  }

  async function getShifts (waiterName) {
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
    getShifts,
    addWaiterName,
    checksWaiterName
  }
}
