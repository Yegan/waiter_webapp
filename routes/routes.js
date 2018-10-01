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

      let getAllShifts = await waiterFunc.getShifts(user)

      console.log(getAllShifts)
      res.render('home', { displayDays, user, days })
    } catch (error) {
      console.error('Can not post', error)
    }
  }

  return {
    home,
    selectedWorkDays
  }
}
