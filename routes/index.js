const express = require('express')
const path = require('path')
const router = express.Router()
const indexController = require("./../controller/indexController");

router.get('/', (req, res) => {
     res.render('index.html')
})

router.get('/achievements', (req, res) => {
    res.render(path.join(__dirname, '../views', 'achievement.html'))
})

router.get('/articles', (req, res) => {
    res.render(path.join(__dirname, '../views', 'article.html'))
})

router.get('/news', (req, res) => {
    res.render(path.join(__dirname, '../views', 'new.html'))
})

router.get('/search', (req, res) => {
    res.render(path.join(__dirname, '../views', 'search.html'))
})

router.get('/adsearch', (req, res) => {
    res.render(path.join(__dirname, '../views', 'adsearch.html'))
})

router.get('/map', (req, res) => {
    res.render(path.join(__dirname, '../views', 'map.html'))
})

router.get('/authors', (req, res) => {
    res.render(path.join(__dirname, '../views', 'author.html'))
})

router.get('/authorLists', (req, res) => {
    res.render(path.join(__dirname, '../views', 'authorLists.html'))
})

router.get('/feedback', (req, res) => {
    res.render(path.join(__dirname, '../views', 'feedback.html'));
});

router.post('/sendFeedback', indexController.sendFeedback);

module.exports = router
