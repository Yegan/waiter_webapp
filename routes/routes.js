module.exports = function (waiterFunc) {
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
      let days = req.body.dayName

      await waiterFunc.addWaiterName(user)
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
      console.log(shifts)
      res.render('shifts', { shifts })
    } catch (error) {
      next(error.stack)
    }
  }

  return {
    home,
    selectedWorkDays,
    displayShifts,
    login
  }
}
