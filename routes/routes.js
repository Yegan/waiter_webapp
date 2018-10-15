module.exports = function (waiterFunc) {
  async function path (req, res, next) {
    try {
      res.render('user')
    } catch (error) {
      next(error.stack)
    }
  }

  async function home (req, res, next) {
    try {
      let user = req.params.username
      let displayDays = await waiterFunc.getDaysAndNames(user)
      res.render('home', { displayDays, user })
    } catch (error) {
      next(error.stack)
    }
  }

  async function login (req, res, next) {
    try {
      let user = req.query.user
      if (!user) {
        res.render('user')
      } else {
        res.redirect(`/waiters/${user}`)
      }
    } catch (error) {
      next(error.stack)
    }
  }

  async function selectedWorkDays (req, res, next) {
    try {
      let user = req.params.username
      let days = Array.isArray(req.body.dayName) ? req.body.dayName : [req.body.dayName]
      await waiterFunc.addWaiterName(user)
      req.flash('successfully', `Your shift has been added ${user}`)
      // let displayDays = await waiterFunc.daysOfTheWeek()
      await waiterFunc.storeShifts(user, days)
      // displayShifts brings an object with waiter name and week_day which is the shift day chosen by the waiter
      let displayDays = await waiterFunc.getDaysAndNames(user)
      res.render('home', { displayDays, user, days })
    } catch (error) {
      next(error.stack)
    }
  }

  async function displayShifts (req, res, next) {
    try {
      let shifts = await waiterFunc.rosterOfWaitersAndDays()
      res.render('shifts', { shifts })
    } catch (error) {
      next(error.stack)
    }
  }
  async function deleteAll (req, res, next) {
    try {
      let shiftReset = await waiterFunc.tableDelete()

      req.flash('delete', 'All waiter shifts have been cleared')
      res.redirect('shifts')
    } catch (error) {
      next(error)
    }
  }

  return {
    home,
    selectedWorkDays,
    displayShifts,
    login,
    path,
    deleteAll
  }
}
