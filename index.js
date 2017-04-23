const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const VKAPI = require('node-vkapi');
const VK = new VKAPI({
    token: "04916a8c74238b2065c4320c9d95de8806413bce7b28232d1cdfcd6f84fa2c7381ff6ebb3e01f325aea1e"
});
const PORT = process.env.PORT || 3000;

// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    let mes;
    VK.call('messages.get', {
        out: 0,
    }).then((messages) => {
        mes = messages;
        console.log('Done');
        console.log(mes.items[mes.items.length - 1].user_id);
        // res.send(JSON.stringify(messages));
        return VK.call('messages.send', {
            // user_id: mes.items[mes.items.length - 1].user_id,
            user_id: 153503782,
            message: 'О, мне прислали сообщение. Спасибо'
        });
    }).then(() => {
        res.send('Message sent');
    }).catch(err => {
        console.log(err);
    })

});
app.post('/', (req, res) => {
    let json = req.body;
    if (json.type === "confirmation" && (json.group_id === 145656698 || "145656698")) {
        res.send('b78abcff');
    }
    res.send(JSON.stringify(req.body));
});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});