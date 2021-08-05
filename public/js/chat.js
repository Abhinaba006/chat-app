const socket = io()

// socket.on('countUpdated', (count)=>{    //order matter
//     console.log('count has been updated ', count)
// })

// const btn = document.querySelector('#increment')

// btn.addEventListener('click', ()=>{
//     socket.emit('increment')
// })
// let warn = document.querySelector('#warnMsg')

const $messages = document.querySelector('#messages')

// options
const { userName, room } = Qs.parse(window.location.search, { ignoreQueryPrefix: true })
const sideBarTemplate = document.querySelector('#sidebar-template').innerHTML

const autoscroll = ()=>{
    // new mwssage ele
    const $newMessage = $messages.lastElementChild


    // get height of last message
    const newMsgStyle = getComputedStyle($newMessage)
    const newMsgMargin = parseInt(newMsgStyle.marginBottom)
    const newMsgHeight = $newMessage.offsetHeight + newMsgMargin

    // visible height
    const visibleHeight = $messages.offsetHeight

    // height of messages container
    const contentHeight = $messages.scrollHeight

    // How far have i scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(contentHeight - newMsgHeight <= scrollOffset){ // check if we already at bottom
        $messages.scrollTop = $messages.scrollHeight 
    }
}

// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
socket.on('msg', (msg) => {
    console.log(msg)
    const html = Mustache.render(messageTemplate, {
        userName: msg.user,
        msg: msg.text,
        created_at: moment(msg.created_at).format('h:mm a')
    })
    // console.log(typeof(html))
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()

})

// var
const $messageForm = document.querySelector('#msgFrm')
const $messageFomInput = $messageForm.querySelector('input')
const $messageFomBtn = $messageForm.querySelector('button')

socket.on('roomdata',({room, user})=>{
    console.log(user)
    const html = Mustache.render(sideBarTemplate, {
        room,
        user
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    // disable form
    $messageFomBtn.setAttribute('disabled', 'disabled')
    e.preventDefault()

    const msg = e.target.elements.msg.value
    socket.emit('newMsg', msg, (e) => {

        //enable
        $messageFomBtn.removeAttribute('disabled')
        // clr input
        $messageFomInput.value = ''
        $messageFomInput.focus()
        if (e) console.log(e)
        else console.log('delivered')
    })
})

const $sndLocationBtn = document.querySelector('#loc')
$sndLocationBtn.addEventListener('click', () => {
    $sndLocationBtn.setAttribute('disabled', 'disabled')
    if (!navigator.geolocation) {
        return alert('geo location is not suported')
    }
    navigator.geolocation.getCurrentPosition((pos) => {
        console.log(pos.coords)
        socket.emit('Locmsg', {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude
        }, () => {
            console.log('location send')
        })
        $sndLocationBtn.removeAttribute('disabled')
    })
})

const locTemplate = document.querySelector('#location-template').innerHTML
socket.on('Locmsg', (msg) => {
    console.log('hi ', msg)
    const html = Mustache.render(locTemplate, {
        url: msg.url,
        created_at: moment(msg.created_at).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)

    autoscroll()
})

socket.emit('join', { userName, room }, (error) => {
    if (error) {
        alert(error)
        location.herf = '/' // sending them to root
    }
})