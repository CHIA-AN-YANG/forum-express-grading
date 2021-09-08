const { Restaurant, User, Category } = require('../models')
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

const adminService = {
  getUsers: (req, res, callback) => {User.findAll({raw: true}) //將找到的資料塞進特定callback去執行
    .then(users => callback({users}))
    .catch(err => res.status(422).json(err))
  },
  
  getRestaurants: (req, res, callback) => {
    Restaurant.findAll({raw: true, nest: true, include: [Category]})
    .then(restaurants => callback({restaurants}))
    .catch(err => res.status(422).json(err))
  },

  getRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id, {raw:true, nest:true, include: [Category]})
    .then(restaurant => callback({restaurant}))
    .catch(err => res.status(422).json(err))
  },

  createRestaurant: (req, res, callback) => {
    Category.findAll({raw:true, nest:true})
    .then(categories => callback({categories}))
    .catch(err => res.status(422).json(err))    
  },

  editRestaurant: (req, res, callback) => {
    Restaurant.findByPk(req.params.id, {raw:true, include: [Category]})
    .then(restaurant => { 
      Category.findAll({raw:true, nest:true})
      .then(category => callback({restaurant, category}))
      .catch(err => res.status(422).json(err)) 
    })
  },
//send created restaurant

  postRestaurant: (req, res, callback) => {
    if(!req.body.name){
      return callback({
        status:'error', 
        message:'Creation failed. No name received.'})}
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
          if (err) console.log('Error: ', err)
            return Restaurant.create({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : null,
              CategoryId: Number(req.body.categoryId)
            })
            .then((restaurant) => {
              callback({statuse:'success', massage: 'restaurant was successfully created'})
            })
            .catch(err => res.status(422).json(err))
        })
      } else {
        return Restaurant.create({         
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: null,
          CategoryId: Number(req.body.categoryId)
        }).then((restaurant) => {
          callback({
            statuse:'success',
            massage: 'restaurant was successfully created'
          })
        })
        .catch(err => res.status(422).json(err))
      }
  },

  //send edit restaurant
  putRestaurant: (req, res) => {
    const { file } = req 
    if(!req.body.name){
      callback({statuse:'error', massage: `name doesn't exist`})
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        if (err) console.log('Error: ', err)
          return Restaurant.findByPk(req.params.id, {include: [Category]})
          .then((restaurant) => {
            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: Number(req.body.categoryId)
            })                        
          })          
          .then(() => {
            callback({
              statuse:'success', 
              massage: 'restaurant was successfully edited (with file)'
            })
          })
      })
    } else {
      Restaurant.findByPk(req.params.id, {include: [Category]})
        .then((restaurant) => {
          restaurant.name = req.body.name
          restaurant.tel = req.body.tel
          restaurant.address = req.body.address
          restaurant.opening_hours = req.body.opening_hours
          restaurant.description = req.body.description
          restaurant.CategoryId = Number(req.body.categoryId)
          return restaurant.save() 
        })
      .then(() => {
        callback({
          statuse:'success', 
          massage: 'restaurant was successfully edited'
        })
      })
    }
  },

  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => restaurant.destroy())
      .then(() => callback({ status:'sucess', message:'' }))
  },
  
}

module.exports = adminService