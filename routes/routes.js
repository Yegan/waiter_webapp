module.exports = function (waiterFunc) {
  async function home (req, res, next) {
    try {
      let user = req.params.username
      let displayDays = await waiterFunc.daysOfTheWeek()
      res.render('home', { displayDays, user })
    } catch (error) {
      next(error.stack)
    }
  }

  async function selectedWorkDays (req, res, next) {
    try {
      let user = req.params.username
      let days = req.body.dayName

      await waiterFunc.addWaiterName(user)
      let displayDays = await waiterFunc.daysOfTheWeek()
      await waiterFunc.storeShifts(user, days)

      let getAllShifts = await waiterFunc.getAllShifts()

      console.log(getAllShifts)
      res.render('home', { displayDays, user, days })
    } catch (error) {
      next(error.stack)
    }
  }

  async function displayShifts (req, res, next) {
    try {
      let displayDays = await waiterFunc.daysOfTheWeek()
      let shifts = await waiterFunc.waiterShifts()
      console.log(shifts)
     // let waiter = await waiterFunc.checksWaiterName()
      res.render('shifts', { displayDays, shifts })
    } catch (error) {
      next(error.stack)
    }
  }

  return {
    home,
    selectedWorkDays,
    displayShifts
  }
}
