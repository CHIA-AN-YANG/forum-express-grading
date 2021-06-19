const bcrypt = require('bcryptjs') 
const db = require('../models')
const User = db.User

const userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    const {name, email, password, passwordCheck} = req.body
    const returnUser = {name, email}
    const errorArr = []
    if(!name || !email || !password){errorArr.push('所有的空格都要填寫。')}
    if(passwordCheck !== password){errorArr.push('確認密碼與密碼不一樣。')}
    if(name.length>10){errorArr.push('名字必須小於十個字元。')}
    if(password.length>10){errorArr.push('密碼必須小於十個字元。')}
    if(email.length>127){errorArr.push('Email太長了。')}
    User.findOne({where:{email}}).then(user => {
      if(user){errorArr.push('Email已經存在！請登入。')}
      if(errorArr.length){return res.render('signup', { returnUser, errorArr })}
      return User.create({
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)})
        .then(user => {
        req.flash('success_messages', '成功註冊帳號！請重新登入')
        return res.redirect('signin')})
        .catch(err => res.status(422).json(err))

    })   
  
    

  },

  signInPage: (req, res) => {
    return res.render('signin')
  },
 
  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('restaurants')
  },
 
  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('signin')
  }
}

module.exports = userController