const VKAPI = require('node-vkapi');
const api = require('../api/weatherApi');
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
        console.log(JSON.stringify(messageArr));
        return this.sendMessage(281699141, `Мне прислали ${JSON.stringify(messageArr)}`).then(() => {
            return api.fetchWeatherForCity(messageArr[1]);
        }).then((string) => {
            console.log(message.user_id);
            console.log(string);
            return this.sendMessage(message.user_id, string);
        });
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