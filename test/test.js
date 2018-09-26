'use strict'
const assert = require('assert')
const waiterFunc = require('../waiterFunc.js')
const postgres = require('pg')
const Pool = postgres.Pool

const connectionString = process.env.DATABASE_URL || 'postgres://coder:pg123@localhost:5432/waiter-db'

const pool = new Pool({
  connectionString
})

describe('Waiter Web-App', function () {
  beforeEach(async function () {
    await pool.query('delete from waiters_table')
    await pool.query('delete from days_of_the_week')
    await pool.query('delete from shift_days')

    // inserting the days of the week into days_of_the_week table

    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Monday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Tuesday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Wednesday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Thursday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Friday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Saturday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Sunday'])
  })
  it('The function should bring back all the days of the week from the table ', async function () {
    const weekDays = [ 'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday' ]

    let funcWaiter = waiterFunc(pool)

    let daysOfTheWeek = await funcWaiter.daysOfTheWeek()

    const daysInDatabase = daysOfTheWeek.map((r) => r.days_of_week)
    console.log(daysInDatabase)

    assert.deepEqual(daysInDatabase, weekDays)

    // look at lists every and includes function

  })

  after(async function () {
    await pool.end()
  })
})
