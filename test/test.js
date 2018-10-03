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

  it('The function should check if Yegan has been entered into the database ', async function () {
    let waiterShiftManager = WaiterShiftManager(pool)

    await waiterShiftManager.addWaiterName('Yegan')
    await waiterShiftManager.addWaiterName('Greg')

    let selectWaiter = await waiterShiftManager.checksWaiterName()
    let waiter = ['Yegan', 'Greg']

    let waiterMap = selectWaiter.map((result) => result.waiter_name)
    assert.deepEqual(waiterMap, waiter)
  })

  it('should store the days that a waiter has selected to work', async function () {
    // assemble - get things ready to make it happen
    let waiterShiftManager = WaiterShiftManager(pool)
    await waiterShiftManager.addWaiterName('Yegan')

    let daysOfTheWeek = await waiterShiftManager.daysOfTheWeek()
    const Monday = daysOfTheWeek[0]
    const Saturday = daysOfTheWeek[5]

    const shiftDays = ['Monday', 'Saturday']

    const waiterYegan = 'Yegan'
    // act - make it happen

    await waiterShiftManager.storeShifts(waiterYegan, shiftDays)
    // assert - did the right thing happen?

    // check if there is two shifts for Andy in the Database
    const shiftsForYegan = await waiterShiftManager.aWaitersShift(waiterYegan)

    // assert.equal()
    assert.equal(Monday.id, shiftsForYegan[0].day_id)
    assert.equal(Saturday.id, shiftsForYegan[1].day_id)
  })

  it('should get all the days and all the shifts and match the waiter name to the corresponding day name of each shift ', async function () {
    let waiterShiftManager = WaiterShiftManager(pool)
    await waiterShiftManager.addWaiterName('Yegan')

    const shiftDays = ['Monday', 'Saturday']

    const waiterYegan = 'Yegan'
    // act - make it happen

    await waiterShiftManager.storeShifts(waiterYegan, shiftDays)


     let yegansShifts = await waiterShiftManager.aWaitersShift(waiterYegan)
    assert.equal(yegansShifts[0].waiter_name, 'Yegan')
    assert.equal(yegansShifts[0].week_day, 'Monday')
    assert.equal(yegansShifts[1].waiter_name, 'Yegan')
    assert.equal(yegansShifts[1].week_day, 'Saturday')


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
