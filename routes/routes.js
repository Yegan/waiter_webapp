module.exports = function (waiterFunc) {
  async function home (req, res, next) {
    try {
      let displayDays = await waiterFunc.daysOfTheWeek()
      res.render('home', { displayDays })
    } catch (error) {
      next(error.stack)
    }
  }

  return {
    home
  }
}
