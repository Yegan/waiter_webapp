module.exports = function (pool) {
  // returns all of the days of the week from the days of the week table
  async function daysOfTheWeek () {
    let weekDays = await pool.query('select * from days_of_the_week')
    return weekDays.rows
  }

  // adds a waiter into the database only if the name of the waiter has not yet been added
  async function addWaiterName (name) {
    name.toUpperCase()
    let nameOfWaiter = await pool.query('select * from waiters_table where waiter_name =$1', [name])

    let getWaiter = nameOfWaiter.rowCount
    if (getWaiter === 0) {
      await pool.query('insert into waiters_table(waiter_name) values($1)', [name])
    }
  }
  // checks all the waiter names in the database
  async function checksWaiterName () {
    let waiters = await pool.query('select waiter_name from waiters_table')
    return waiters.rows
  }

  // assigns waiters with corresponding days selected
  async function storeShifts (waiterName, shiftDays) {
    let waiterResult = await pool.query('select id from waiters_table where waiter_name = $1', [waiterName])
    let waiterId = waiterResult.rows[0].id
    await pool.query('delete from shift_days where waiter_id =$1', [waiterId])

    for (let eachDay of shiftDays) {
      let dayResult = await pool.query('select id from days_of_the_week where days_of_week = $1', [eachDay])
      let dayId = dayResult.rows[0].id
      await pool.query('insert into shift_days(waiter_id, days_id) values ($1, $2)', [waiterId, dayId])
    }
  }

  // returns waiters who are working a particular shift
  async function waiterShifts (name) {
    const waiterShift = `select * from waiters_table 
  join shift_days on shift_days.waiter_id = waiters_table.id
  join days_of_the_week on days_of_the_week.id = shift_days.days_id
  where waiter_name = $1 `

    let result = await pool.query(waiterShift, [name])
    return result.rows
  }
  // returns all the days that all waiters have chosen to work
  async function getAllShifts () {
    const waiterShiftQuery = `select 
        waiters_table.id as waiter_id,
        waiters_table.waiter_name,
        shift_days.days_id as day_id,
        days_of_week as week_day
      from waiters_table 
        join shift_days on waiters_table.id = shift_days.waiter_id 
        join days_of_the_week on days_of_the_week.id = shift_days.days_id`

    let waiterShifts = await pool.query(waiterShiftQuery)
    return waiterShifts.rows
  }

  // displays shift for a waiter that the waiter has chosen to work
  async function aWaitersShift (waiterName) {
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
  // compares two lists against each other comparing if days of the week match and thus adding a new key value pair to the object
  async function getDaysAndNames (name) {
    let shiftForX = await aWaitersShift(name)
    let daysOfShift = await daysOfTheWeek()
    for (const waiters of shiftForX) {
      for (const day of daysOfShift) {
        if (waiters.week_day === day.days_of_week) {
          day.checked = 'checked'
        }
      }
    }
    return daysOfShift
  }
  async function rosterOfWaitersAndDays () {
    let waiterAndShifts = await pool.query(`select days_of_the_week.id, days_of_the_week.days_of_week, waiters_table.id, waiters_table.waiter_name
    from days_of_the_week
    left join shift_days on shift_days.days_id = days_of_the_week.id
    left join waiters_table on waiters_table.id = shift_days.waiter_id;`)

    let list = [
      {
        day: 'Monday',
        waiters: [],
        status: 'no-waiters'
      },
      {
        day: 'Tuesday',
        waiters: [],
        status: 'no-waiters'
      },
      {
        day: 'Wednesday',
        waiters: [],
        status: 'no-waiters'
      },
      {
        day: 'Thursday',
        waiters: [],
        status: 'no-waiters'
      },
      {
        day: 'Friday',
        waiters: [],
        status: 'no-waiters'
      },
      {
        day: 'Saturday',
        waiters: [],
        status: 'no-waiters'
      },
      {
        day: 'Sunday',
        waiters: [],
        status: 'no-waiters'
      }

    ]

    let shifts = waiterAndShifts.rows
    // console.log(shifts)
    for (let i = 0; i < shifts.length; i++) {
      let currentShift = shifts[i]
      // console.log(currentShift)
      if (currentShift.waiter_name) {
        list.forEach(listDay => {
          if (listDay.day === currentShift.days_of_week) {
            listDay.waiters.push(currentShift.waiter_name)
            // the number of waiters for the day changed...        
            if (listDay.waiters.length > 0 && listDay.waiters.length < 3) {
              listDay.status = 'not-enough'
            } else if (listDay.waiters.length === 3) {
              listDay.status = 'enough'
            } else if (listDay.waiters.length > 3) {
              listDay.status = 'too-many'
            }
          }
        })
      }
    }
    // console.log(list)
    return list
  }
  async function tableDelete () {
    await pool.query('delete from shift_days')
    await pool.query('delete from waiters_table')
  }

  return {
    daysOfTheWeek,
    storeShifts,
    aWaitersShift,
    getAllShifts,
    addWaiterName,
    checksWaiterName,
    waiterShifts,
    getDaysAndNames,
    rosterOfWaitersAndDays,
    tableDelete
  }
}
