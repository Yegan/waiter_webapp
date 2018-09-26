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
}
