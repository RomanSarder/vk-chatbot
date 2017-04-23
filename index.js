const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const VKAPI = require('node-vkapi');
const VK = new VKAPI({
    token: "04916a8c74238b2065c4320c9d95de8806413bce7b28232d1cdfcd6f84fa2c7381ff6ebb3e01f325aea1e"
});
const PORT = process.env.PORT || 3000;
const me = 425331872;

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
let mes;
app.get('/', (req, res) => {

    VK.call('messages.get', {
        out: 0,
    }).then((messages) => {
        mes = messages;
        console.log('Done');
        console.log(mes.items[mes.items.length - 1].user_id);
        // res.send(JSON.stringify(messages));
        return VK.call('messages.send', {
            user_id: mes.items[mes.items.length - 1].user_id,
            message: 'Привет, я даже могу тебе вот так ответить!'
        });
    }).then(() => {
        res.send(JSON.stringify(mes));
    }).catch(err => {
        console.log(err);
    })

});
app.post('/', (req, res) => {
    let json = req.body;
    if (json.type === "confirmation" && (json.group_id === 145656698 || "145656698")) {
        res.send('b78abcff');
    }
    VK.call('message.send', {
        user_id: me,
        message: 'Я получил оповещение о сообщении'
    }).then(() => {
        return VK.call('message.send', {
            user_id: me,
            message: JSON.stringify(mes)
        })
    }).then(() => {
        return VK.call('message.send', {
            user_id: me,
            message: JSON.stringify(json)
        })
    }).then(() => {
        res.status(200).send('ok');
    })
});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});