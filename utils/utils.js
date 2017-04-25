const VKAPI = require('node-vkapi');
const api = require('../api/weatherApi');
const constructors = require('./constructors');
const VK = new VKAPI({
    token: "dca344809339514735a5199dbd7f0287dde1a9e9aefff1784cc8e4211ca2af5e0478dcb4930dd81cc1fd0"
});

module.exports = {
    displayMessages() {
        return VK.call('messages.get', {
            out: 0,
        });
    },
    handleMessage(message) {
        let messageArr = message.body.trim().split(' ');
        return api.fetchWeatherForCity(messageArr[1]).then((res) => {
            messageArr[1] = res.city;
            let response = constructors.generateMessage(message, res, messageArr);
            return this.sendMessage(message.user_id, response);
        }).catch((e) => {
            return this.sendMessage(message.user_id, 'Случилась непредвиденная ошибка. Попробуйте еще раз!').then(() => {
                this.sendMessage(281699141, `Случилась ошибка:
                Message object: ${JSON.stringify(message)}
                Error: ${e.message}`);
            }).catch((e) => {
                console.log(e);
            })
        })
    },
    sendMessage(to, message) {
        return VK.call('messages.send', {
            user_id: to,
            message: message
        });
    },
    recieveRequest(req) {
        switch (req.type) {
            case 'message_new':
                return this.handleMessage(req.object);
            default:
                return this.sendMessage(281699141, 'VK request recieved').then(() => {
                    return this.sendMessage(281699141, JSON.stringify(req));
                });
        }
    }
}