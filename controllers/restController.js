const db = require('../models')
const Restaurant = db.Restaurant

const restController = {

  getRestaurants: (req, res) => {
    Restaurant.findAll({raw:true, nest:true})
    .then((restaurants) => { res.render('restaurants', { restaurants }) })
    .catch(err => res.status(422).json(err))},

  getRestaurant: (req, res) => {
    Restaurant.findbyPk(req.params.id, {raw:true, nest:true})
    .then((restaurant) => { res.render('restaurant', { restaurant }) })
    .catch(err => res.status(422).json(err))}

}

module.exports = restController