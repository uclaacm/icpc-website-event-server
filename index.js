const express = require('express')
var fs = require('fs');
var https = require('https');
const http = require('http');
const app = express()
const port = 4000
var cors = require("cors");
app.use(express.json());
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-west-2",
  endpoint: "https://dynamodb.us-west-2.amazonaws.com",
  accessKeyId: "AKIAWPRAX2TAS4LMHHJZ",
  secretAccessKey: "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"
});
var docClient = new AWS.DynamoDB.DocumentClient();


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/events', (req, res) => {
    let params = {
        TableName: "upcomingEvents",
    };
    docClient.scan(params, function(err, data) {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
            res.json({message: JSON.stringify(err, null, 2)})
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            res.json(data.Items)
        }
    });
});

app.post('/update', (req, res) => {
    console.log(req.body);
    let params = {
      TableName: "upcomingEvents",
      Item: req.body,
    };
    docClient.put(params, function(err, data) {
      if (err) {
        console.error("Unable to add event", req.body, ". Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("PutItem succeeded:", req.body);
	res.header("Access-Control-Allow-Origin", "*");
        res.json({message: "PutItem succeeded:"})
      }
    }.bind(this));
})

app.post('/delete', (req, res) => {
  console.log(req.body);
  let params = {
    TableName: "upcomingEvents",
    Key: {
      pkey: req.body.pkey,
    }
  };
  docClient.delete(params, function(err, data) {
    if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("DeleteItem succeeded:", req.body);
	res.json({message: "DeleteItem succeeded"});
    }
});
})

http.createServer(app).listen(4000, () => {
  console.log(`Example app listening on port ${port}`)
});

/*https
  .createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert'),
  },app)
  .listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})*/