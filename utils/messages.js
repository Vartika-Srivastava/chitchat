const moment = require('moment');

function formatMessage(uname, text) {
    return{
        uname,
        text,
        time: moment().format('h:mm a')
    }
}

module.exports = formatMessage