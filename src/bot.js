const Bot = require('./lib/Bot')
const SOFA = require('sofa-js')
const Fiat = require('./lib/Fiat')

let bot = new Bot()
var dictionary = {};




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

    console.log(session.data.address)
    session.set('coins', 10);

}


function onCommand(session, command) {
    switch (command.content.value) {
    case 'geefPKP':
        geefPKP(session)
        break
    case 'krijgPKP':
        krijgPKP(session)
        break
    case 'checkCoins':
        checkCoins(session)
        break
    }
}

function geefPKP(session) {

    sendMessage(session, "Dankje voor je parkeerplaats, hier heb je een coin! :) ");
    var blup = session.get('coins');
    var aantalcoins = blup + 1;
    session.set('coins', aantalcoins);
}

function krijgPKP(session) {

    if (session.get('coins') > 0) {
        var number = session.get('coins');
        var coins = number - 1;
        session.set('coins', coins);
        sendMessage(session, "Hier is je pkp: 100");
    } else sendMessage(session, "Onvoldoende Coins");
}

function checkCoins(session) {
    sendMessage(session, "Aantal coins over: " + session.get('coins'))
}

function onPayment(session) {
    for (key in dictionary) {
        console.log(key)
        sendMessage(session, key + '')
    }
}

// STATES

function welcome(session) {

    session.set('coins', 10);
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
// HELPERS

function sendMessage(session, message) {
    let controls = [
        {
            type: 'button',
            label: 'Ik geef een PKP',
            value: 'geefPKP'
        },
        {
            type: 'button',
            label: 'Geef mij een PKP',
            value: 'krijgPKP'
        },
        {
            type: 'button',
            label: 'check coins',
            value: 'checkCoins'
        }
  ]
    session.reply(SOFA.Message({
        body: message,
        controls: controls,
        showKeyboard: false,
    }))
    console.log(dictionary)
}