const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const VKAPI = require('node-vkapi');
const VK = new VKAPI({
    token: "dca344809339514735a5199dbd7f0287dde1a9e9aefff1784cc8e4211ca2af5e0478dcb4930dd81cc1fd0"
});
const PORT = process.env.PORT || 3000;
const me = 281699141;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
let mes;
app.get('/', (req, res) => {

    VK.call('messages.get', {
        out: 0,
    }).then((messages) => {
        mes = messages;
        res.send(JSON.stringify(mes));
    }).catch(err => {
        console.log(err);
        res.send(JSON.stringify(err));
    })

});
app.post('/', (req, res) => {
    let json = req.body;
    if (json.type === "confirmation" && (json.group_id === 145656698 || "145656698")) {
        res.send('b78abcff');
    }
    VK.call('messages.send', {
        user_id: me,
        message: 'VK посылали мне запрос!'
    }).then(() => {
        return VK.call('messages.send', {
            user_id: me,
            message: JSON.stringify(json)
        })
    }).then(() => {
        res.status(200).send('ok');
    }).catch((err) => {
        console.log(err);
        res.send(JSON.stringify(err));
    })


});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});