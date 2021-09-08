const { Category } = require('../models')

let categoryService = {
  getCategories: (req, res, callback) => {
    return Category.findAll({ raw: true, nest: true })
    .then(categories => {
      if (req.params.id) {
        return Category.findByPk(req.params.id)
        .then((category) => {
          callback({categories, category: category.toJSON()})
          })
      } else { return callback({categories}) }
    })},

  postCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({status:'error', massage: 'name does not exist'})
    } else {
      return Category.create({
        name: req.body.name
      })
        .then((category) => {
          callback({
            status:'success', 
            massage: 'Category created.'
          })
        })}},

  putCategory: (req, res, callback) => {
    if (!req.body.name) {
      callback({status:'error', massage: 'name does not exist'})
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.update(req.body)
        .then((category) => { 
          callback({
          status:'success',
          massage: 'category edited.'
          })          
        })})}
  },

  deleteCategory: (req, res, callback) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        if(!category){return callback({status:'error', massage: 'category does not exist. Therefore, it cannot be deleted.'})}
        category.destroy()
          .then((category) => {
            callback({status:'success', massage: 'category deleted.'})
          })})}

}
module.exports = categoryService