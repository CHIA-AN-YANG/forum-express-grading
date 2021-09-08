const adminService = require('../../services/adminService')


const adminController = {
getRestaurants: (req, res) => {
adminService.getRestaurants(req, res, (data) => {
  res.json(data)})},

getRestaurant: (req, res) => {
adminService.getRestaurant(req, res, (data) => {
  res.json(data)})},

deleteRestaurant: (req, res) => {
adminService.deleteRestaurant(req, res, (data) => {
  res.json(data)
  if(data['status'] === 'success'){res.redirect('/admin/restaurants')}
  })},

postRestaurant: (req, res) => {
  adminService.postRestaurant(req, res, (data) => {
    res.json(data)
    if(data['status'] === 'error'){
      req.flash('danger_messages', data['message'])
      res.redirect('back')
    }
    if(data['status'] === 'success'){
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    }
    })},

}

module.exports = adminController