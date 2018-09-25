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

    await pool.query('insert into days_of_the_week(days_of_week) values($1)', ['Monday'])
  })


  describe('')

  after(async function () {
    await pool.end()
  })
})
