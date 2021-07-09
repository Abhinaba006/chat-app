const genMsg = (text) => {
    return {
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