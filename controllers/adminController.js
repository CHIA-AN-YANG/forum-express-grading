const db = require('../models')
const Restaurant = db.Restaurant
const fs = require('fs')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = '26b0737b69bb564'

const adminController = {
  getRestaurants: (req, res) => {
    Restaurant.findAll({raw: true})
    .then(restaurants => {
      return res.render('admin/restaurants', {restaurants: restaurants })
    })
  },

  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {raw:true}).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant
      })
    })
  },

  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {raw:true}).then(restaurant => {
      return res.render('admin/create', { restaurant: restaurant } )
    })
  },
//send created restaurant
  postRestaurant: (req, res) => {
    console.log('params.id: ', req.params.id)
    console.log('req body: ', req.body)
    const { file } = req
    if(!req.body.name){
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      fs.readFile(file.path, (err, data) => {
          if (err) console.log('Error: ', err)
          fs.writeFile(`upload/${file.originalname}`, data, () => {
            
            let imgStorage

            if (process.env.NODE_ENV === 'production'){
                    imgStorage = img.data.link
              }else{imgStorage = `/upload/user-upload/${file.originalname}`}

            return Restaurant.create({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? imgStorage : null
            })
            .then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully created')
              return res.redirect('/admin/restaurants')
            })
            .catch(err => res.status(422).json(err))
          })
        })
      } else {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description
        }).then((restaurant) => {
          req.flash('success_messages', 'restaurant was successfully created')
          return res.redirect('/admin/restaurants')
        })
        .catch(err => res.status(422).json(err))
      }
  },

  //send edit restaurant
  putRestaurant: (req, res) => {
    console.log('params.id: ', req.params.id)
    console.log('req body: ', req.body)
    const { file } = req 
    if(!req.body.name){
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return Restaurant.findByPk(req.params.id)
          .then((restaurant) => {
            let imgStorage
            if (process.env.NODE_ENV === 'production'){
                    imgStorage = img.data.link
              }else{imgStorage = `/upload/user-upload/${file.originalname}`}

            restaurant.update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: imgStorage
            })                        
          })          
          .then(() => {
            req.flash('success_messages', '餐廳已成功更新(含檔案)！')
            return res.redirect('/admin/restaurants')
          })
        })
      })
    } else {
      Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.name= req.body.name
          restaurant.tel= req.body.tel
          restaurant.address= req.body.address
          restaurant.opening_hours= req.body.opening_hours
          restaurant.description= req.body.description
          return restaurant.save() 
        })
      .then(() => {
        req.flash('success_messages', '餐廳已成功更新！')
        return res.redirect('/admin/restaurants')
      })
    }
  },

  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  }
}

module.exports = adminController