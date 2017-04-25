const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const utils = require('./utils/utils');
const PORT = process.env.PORT || 3000;

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
        console.log(e);
        res.send(e);
    })


});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});