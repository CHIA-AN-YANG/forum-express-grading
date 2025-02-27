const categoryService = require('../../services/categoryService')

const categoryController = {
  getCategories: (req, res) => {
  categoryService.getCategories(req, res, (data) => {
    res.json(data)})},

  postCategory: (req, res) => {
    categoryService.postCategory(req, res, (data) => {
      if(data['status'] === 'error'){
        req.flash('danger_messages', data['message'])
        res.redirect('back')
      }
      if(data['status'] === 'success'){
        req.flash('success_messages', data['message'])
        res.redirect('/admin/categories')
      }
    })},

  putCategory: (req, res) => {
    categoryService.putCategory(req, res, (data) => {
      if(data['status'] === 'error'){
        req.flash('danger_messages', data['message'])
        res.redirect('back')
      }
      if(data['status'] === 'success'){
        req.flash('success_messages', data['message'])
        res.redirect('/admin/categories')
      }
    })},
      
  deleteCategory: (req, res) => {
    categoryService.deleteCategory(req, res, (data) => {
      if(data['status'] === 'success'){
        req.flash('success_messages', data['message'])
        res.redirect('/admin/categories')
      }
    })},    
  }

module.exports = categoryController