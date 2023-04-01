const path = require('path')
const express = require('express') // here require('express') exposes a single function 'express'
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

console.log(__dirname)
console.log(__filename)
console.log(path.join(__dirname, '../public'))

// express() creates an entire express application, and we store it in var app.
//'app' has multiple methods to configue the web server [the single 'express' fn. exposed could be returning an object, with multiple methods]
const app = express()

// Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// comment: setup static directory to serve
app.use(express.static(publicDirectoryPath))

// .get() helps to configure the routes.
// (req, res) is from perspective of server.
// 'req' is request going to server, from the requestor
// 'res' is response going out from the server, to the requestor
app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Gaurab',
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About page',
    name: 'Gaurab',
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help Page',
    name: 'Gaurab',
    helpText: 'This page has FAQs',
  })
})

app.get('/weather', (req, res) => {
  if (!req.query.address) {
    return res.send({
      error: 'You must provide an address',
    })
  }
  geocode(
    req.query.address,
    (error, { latitude, longitude, location } = {}) => {
      // res.send(body)
      if (error) {
        return res.send({ error })
      }
      forecast(latitude, longitude, (error, forecastData) => {
        if (error) {
          return res.send({ error })
        }
        res.send({
          forecast: forecastData,
          location,
          address: req.query.address,
        })
      })
    }
  )

  // res.send({
  //   forecast: '30 deg',
  //   location: 'Chennai',
  //   address: req.query.address,
  // })
})

app.get('/products', (req, res) => {
  if (!req.query.search) {
    return res.send({
      error: 'You must provide a search term',
    })
  }
  res.send({
    products: [],
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Gaurab',
    errorMessage: 'Help  article not found',
  })
})

app.get('/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Gaurab',
    errorMessage: '404 page not found',
  })
})

// starts the server and has the server listen on this port
app.listen('3000', () => {
  console.log('Server is up on port 3000')
})
