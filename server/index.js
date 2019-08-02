require('dotenv').config()
const express = require('express')
const massive = require('massive')
const session = require('express-session')
const PORT = 4000
const {CONNECTION_STRING, SESSION_SECRET} = process.env
const authCtrl = require('./controllers/authController')
const treasureCtrl = require('./controllers/treasureController')
const auth = require('./middleware/authMiddleware')

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

app.get('/api/treasure/dragon', treasureCtrl.dragonTreasure) // get dragon treasure
app.get('/api/treasure/user', auth.usersOnly, treasureCtrl.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, treasureCtrl.addUserTreasure)
app.get('/api/treasure/all', auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure)


// image url for tests
// https://i.chzbgr.com/full/3876357/hA9B5E951/1

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
}).catch(err => {
    console.log(`db is whack`, err)
})

app.listen(PORT, () => console.log(`${PORT} squared is ${PORT * PORT / 1000000} million`))