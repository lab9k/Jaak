const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')
let bot = new Bot()
    // ROUTING
bot.onEvent = function (session, message) {
    switch (message.type) {
    case 'Init':
        welcome(session)
        break
    case 'Message':
        onMessage(session, message)
        break
    case 'Command':
        onCommand(session, message)
        break
    case 'Payment':
        onPayment(session)
        break
    case 'PaymentRequest':
        welcome(session)
        break
    }
}

function onMessage(session, message) {
    if (message.body == `help`) {
        var hulp = "Gebruik volgende commando's om tegen de bot te praten \n" + "1. \'plaats\': geeft vrije plaatsen"
        sendMessage(session, hulp)
    }
    else {
        sendMessage(session, message.body)
    }
}

function onCommand(session, command) {
    switch (command.content.value) {
    case 'ping':
        pong(session)
        break
    case 'count':
        count(session)
        break
    case 'donate':
        donate(session)
        break
    case 'dbtonen':
        toondb(session)
        break
    }
}

function onPayment(session) {
    sendMessage(session, `Thanks for the payment! 🙏`)
}
// STATES
function welcome(session) {
    sendMessage(session, `Hallo Wim!`)
}

function pong(session) {
    sendMessage(session, `Pong`)
}
// example of how to store state on each user
function count(session) {
    let count = (session.get('count') || 0) + 1
    session.set('count', count)
    sendMessage(session, `${count}`)
}

function donate(session) {
    // request $1 USD at current exchange rates
    Fiat.fetch().then((toEth) => {
        session.requestEth(toEth.USD(1))
    })
}

function toondb(session) {
    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database("parkingdb.db");
    db.serialize(function () {
            db.each("SELECT * FROM Test", function (err, row) {
                console.log(row);
            });
        });
        db.close();
    }

// HELPERS
function sendMessage(session, message) {
    let controls = [
        {
            type: 'button'
            , label: 'Toon parkeerplaatsen'
            , value: 'ping'
        }
        , {
            type: 'button'
            , label: 'Reserveer plekje'
            , value: 'count'
        }
        , {
            type: 'button'
            , label: 'Parkeerplaats afstaan'
            , value: 'donate'
        }
        , {
            type: 'button'
            , label: 'Toon db'
            , value: 'dbtonen'
        }
  ]
    session.reply(SOFA.Message({
        body: message
        , controls: controls
        , showKeyboard: false
    , }))
}