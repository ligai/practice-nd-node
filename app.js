const express = require('express')
const indexRoute = require('./routes')
const apiRoute = require('./routes/api')
const app = express()
const nunjucks = require('nunjucks')

app.use(express.static('public'))
app.use(express.static('node_modules'))

nunjucks.configure('views', {
    autoescape: true,
    express: app,
	tags: {
		variableStart: '<$',
		variableEnd: '$>'
	}
});

app.use('/', indexRoute)
app.use('/API', apiRoute)

const server = app.listen(3333, function () {
    const host = server.address().address
    const port = server.address().port
    
    console.log('Listening at http://%s:%s', host, port)
})
