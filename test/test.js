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

  it('The function should store the days that a waiter has selected to work', async function () {
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

    assert.equal(Monday.id, shiftsForYegan[0].day_id)
    assert.equal(Saturday.id, shiftsForYegan[1].day_id)
  })

  it('The function should get all the days and all the shifts and match the waiter name to the corresponding day name of each shift ', async function () {
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

  it('The function should update the days that a waiter has selected to work', async function () {
    // assemble - get things ready to make it happen
    let waiterShiftManager = WaiterShiftManager(pool)
    const waiterName = 'Yegan'
    const shiftDays = ['Monday', 'Saturday']
    const updateWorkShifts = ['Tuesday', 'Sunday']

    await waiterShiftManager.addWaiterName(waiterName)
    // ensure there is some shifts in the db
    await waiterShiftManager.storeShifts(waiterName, shiftDays)

    let yegansInitialShifts = await waiterShiftManager.aWaitersShift(waiterName)

    assert.strictEqual(yegansInitialShifts[0].waiter_name, 'Yegan')
    assert.equal(yegansInitialShifts[0].week_day, 'Monday')
    assert.equal(yegansInitialShifts[1].week_day, 'Saturday')

    // act

    // now update these shifts
    await waiterShiftManager.storeShifts(waiterName, updateWorkShifts)

    // assert

    // get the updated shifts
    let yegansUpdatesShifts = await waiterShiftManager.aWaitersShift(waiterName)
    assert.strictEqual(yegansUpdatesShifts[0].waiter_name, 'Yegan')
    assert.equal(yegansUpdatesShifts[0].week_day, 'Tuesday')
    assert.equal(yegansUpdatesShifts[1].week_day, 'Sunday')
  })

  it('The function should return all days along with all corresponding waiters for all days of the week', async function () {
    // assemble - get things ready to make it happen
    let waiterShiftManager = WaiterShiftManager(pool)

    // shifts for all waiters and days of all the waiters
    const schedule = [
      { day: 'Monday',
        status: 'not-enough',
        waiters: ['Andrew', 'Yegan'] },
      { day: 'Tuesday',
        status: 'not-enough',
        waiters: ['Andrew', 'Yegan'] },
      { day: 'Wednesday',
        status: 'no-waiters',
        waiters: [] },
      { day: 'Thursday',
        status: 'not-enough',
        waiters: ['Yegan'] },
      { day: 'Friday',
        status: 'not-enough',
        waiters: ['Andrew'] },
      { day: 'Saturday',
        status: 'no-waiters',
        waiters: [] },
      { day: 'Sunday',
        status: 'not-enough',
        waiters: ['Andrew'] }
    ]
    const waiterYegan = 'Yegan'
    const yeganShift = ['Monday', 'Tuesday', 'Thursday']

    const waiterAndrew = 'Andrew'
    const andrewShift = ['Monday', 'Tuesday', 'Friday', 'Sunday']

    await waiterShiftManager.addWaiterName(waiterAndrew)
    await waiterShiftManager.addWaiterName(waiterYegan)

    await waiterShiftManager.storeShifts(waiterAndrew, andrewShift)
    await waiterShiftManager.storeShifts(waiterYegan, yeganShift)

    // await waiterShiftManager.getAllShifts()

    let shiftSchedule = await waiterShiftManager.rosterOfWaitersAndDays()
    
    console.log(shiftSchedule);
    
    assert.deepEqual(schedule, shiftSchedule)
    
  })

  after(async function () {
    await pool.end()
  })
})
