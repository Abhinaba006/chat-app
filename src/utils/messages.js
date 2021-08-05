const genMsg = (text, user) => {
    console.log('user')
    return {
        user,
        text,
        created_at: new Date().getTime()
    }
}

const genLoc = (text)=>{
    return {
        url:text,
        created_at: new Date().getTime()
    }
}

module.exports = {
    genMsg,
    genLoc  
}