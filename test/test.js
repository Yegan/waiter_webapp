'use strict'
const assert = require('assert')
const WaiterShiftManager = require('../waiterFunc.js')
const postgres = require('pg')
const Pool = postgres.Pool

const connectionString = process.env.DATABASE_URL || 'postgres://coder:pg123@localhost:5432/waiter-db'

const pool = new Pool({
  connectionString
})

describe('Waiter Web-App', function () {
  beforeEach(async function () {
    
    await pool.query('delete from shift_days')
    await pool.query('delete from waiters_table')
    await pool.query('delete from days_of_the_week')

    // inserting the days of the week into days_of_the_week table

    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Monday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Tuesday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Wednesday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Thursday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Friday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Saturday'])
    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Sunday'])
    
    // inserting a name into the waiters table
    await pool.query('insert into waiters_table(waiter_name) values($1)', ['Yegan'])
    
  })
  it('The function should bring back all the days of the week from the table ', async function () {
    const weekDays = [ 'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
      'Sunday' ]

    let waiterShiftManager = WaiterShiftManager(pool)

    let daysOfTheWeek = await waiterShiftManager.daysOfTheWeek()

    const daysInDatabase = daysOfTheWeek.map((r) => r.days_of_week)

    assert.deepEqual(daysInDatabase, weekDays)

  })

  it('should store the days that a waiter has selected to work', async function () {

    // assemble - get things ready to make it happen
    let waiterShiftManager = WaiterShiftManager(pool)

    let daysOfTheWeek = await waiterShiftManager.daysOfTheWeek()
    const Monday = daysOfTheWeek[0]
    const Saturday = daysOfTheWeek[5]
    const shiftDays = [Monday.id, Saturday.id]
    
    const waiterYegan = 'Yegan'
    // act - make it happen

    await waiterShiftManager.storeShifts(waiterYegan, shiftDays)
    
    // assert - did the right thing happen?

    // check if there is two shifts for Andy in the Database
    // let shiftsForYegan = await waiterShiftManager.storeShifts()
    // assert.equal(2, shiftsForYegan.length)
    // assert.ok(Monday, 'Monday not set')
    // assert.ok(Monday.id, 'Monday id not set')

    const shiftsForYegan = await waiterShiftManager.getShifts(waiterYegan)

    assert.equal(Monday.id, shiftsForYegan[0].day_id, 'Monday shift not set correctly')
    assert.equal(Saturday.id, shiftsForYegan[1].day_id, 'Saturday not set correctly')

  })

  // it('should update the days that a waiter has selected to work', async function () {

  //   // assemble - get things ready to make it happen
  //   let waiterShiftManager = WaiterShiftManager(pool);
  //   const waiterName = 'Andy'

  //   let daysOfTheWeek = await waiterShiftManager.daysOfTheWeek()
  //   const Monday = daysOfTheWeek[0];
  //   const Saturday = daysOfTheWeek[5];
    
  //   const Wednesday = daysOfTheWeek[2];
  //   const Thursday = daysOfTheWeek[3];

  //   const shiftDays = [Monday.id, Saturday.id];

  //   await waiterShiftManager.storeShifts(waiterName, shiftDays);

  //   // assert - did the right thing happen?
  //   const updatedShifts = [Wednesday.id, Thursday.id];
  //   await waiterShiftManager.storeShifts(waiterName, updatedShifts);

  //   // check if there is two shifts for Andy in the Database
  //   let shiftsForAndy = await waiterShiftManager.getShifts(waiterName);
  //   assert.equal(2, shiftsForAndy.length);
  //   assert.equal(Wednesday.id, shiftsForAndy[0].day_id);
  //   assert.equal(Thursday.id, shiftsForAndy[1].day_id);

  // })

  after(async function () {
    await pool.end()
  })
})
