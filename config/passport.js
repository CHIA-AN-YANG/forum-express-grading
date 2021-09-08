const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcryptjs')
const { User, Restaurant } = require('../models')
// setup passport strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  (req, email, password, cb) => {
    User.findOne({ where: { email} }).then(user => {
      if (!user) return cb(null, false, req.flash('warning_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('warning_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
  }
))

// serialize and deserialize user
passport.serializeUser((user, cb) => {
  cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
  User.findByPk(id, {include: [ 
    { model: Restaurant, as: 'FavoritedRestaurants' }, //去Restaurant找彼此的junction table裡有FavoritedRestaurants的row
    { model: Restaurant, as: 'LikedRestaurants' },
    { model: User, as: 'Followers' },
    { model: User, as: 'Followings' } ]})
  .then(user => {
    user = user.toJSON()
    return cb(null, user) 
  })
})

module.exports = passport