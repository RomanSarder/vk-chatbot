const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const VKAPI = require('node-vkapi');
const VK = new VKAPI({
    token: "dca344809339514735a5199dbd7f0287dde1a9e9aefff1784cc8e4211ca2af5e0478dcb4930dd81cc1fd0"
});
const utils = require('./utils/utils');
const PORT = process.env.PORT || 3000;
const me = 281699141;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
let mes;
app.get('/', (req, res) => {

    utils.displayMessages().then((messages) => {
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
    utils.recieveRequest(req.body).then(() => {
        res.status(200).send('ok');
    }).catch((e) => {
        res.send(e);
    })


});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});