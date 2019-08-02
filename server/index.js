require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const PORT = 4000
const {CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')

const app = express()

// top level middleware
app.use(express.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}))

app.post('/auth/register', authCtrl.register) // register a new user
app.post('/auth/login', authCtrl.login) // login as an existing user
app.get('/auth/logout', authCtrl.logout) // logout the current user

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure)

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
}).catch(err => {
    console.log(`db is whack`, err)
})

app.listen(PORT, () => console.log(`${PORT} squared is ${PORT * PORT / 1000000} million`))