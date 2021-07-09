const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const path = require('path')
const Filter = require('bad-words')

const {genMsg, genLoc} = require('./utils/messages')

const app = express()
const server = http.createServer(app) // express does this behind the secne
    // new instant
const io = socketio(server) // expected to be called with raw http server, so we created our own

const port = process.env.PORT || 3000
const public_path = path.join('./public')

app.use(express.static(public_path));

// let count = 0
let msg = "Welcome"


io.on('connection', (socket) => { // socket is an obj about the connection
    console.log('new web socket connection')
        // io.emit('newMsg', msg)
        // socket.emit('countUpdated', count)  // emitingthe event || event name, arg
        // socket.on('increment', ()=>{
        //     count++
        //     // socket.emit('countUpdated', count) emitting to one socket

    //     io.emit('countUpdated', count)

    // })
    socket.on('Locmsg', (coords, callback) => {
        console.log('hi')
        io.emit('Locmsg', genLoc(`https://google.com/maps?q=${coords.lat},${coords.lon}`))
        callback()
    })

    socket.broadcast.emit('msg', genMsg('Welcome'))
    socket.on('newMsg', (msg, callback) => {
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('khisti ka k dichhis bara? ')
        }
        io.emit('msg',  genMsg(msg))
        callback() // this acknowledgement is helpful for 
            // validation like filtering offensive word
    })

    socket.on('disconnect', () => {
        io.emit("msg",  genMsg('Left'))
    })

})

server.listen(port, () => { // server instead of app
    console.log('App is live at port ' + port)
})

// created express server outside express library
// need to load client side