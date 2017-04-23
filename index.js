const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.post('/', (req, res) => {
    let json = req.body;
    if (json.type === "confirmation" && json.group_id === 145656698 || "145656698") {
        res.send('b78abcff');
    }
});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});