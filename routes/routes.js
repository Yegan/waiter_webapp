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

  return {
    home
  }

  async function selectedWorkDays (req, res, next) {
    try {
    let waiterName =  req.params.username 
    let days = req.body.dayName
    let shiftData = {
      waiter: waiterName,
      days: Array.isArray(req.body.dayName) ? req.body.dayName : [req.body.dayName]
    }

    let addWaiter = await waiterFunc.addWaiterName(waiterName)  
    let dayList = await waiterFunc.daysOfTheWeek()
    let shiftDay = await waiterFunc.storeShifts(waiterName, days)
    


    res.render('home',{})

    } catch (error) {
      next(error.stack)
    }
  }
}
