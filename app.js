const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const https = require('https');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("Public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/SignUp.html");
});
app.post("/failure", function(req, res) {
    res.redirect("/");
});

app.post("/", function (req, res) {
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;
    console.log(firstName, lastName, email);
    
    var data = {
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName
            }
        }]
    };
    
    var jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/6f86bb67f0";
    const options = {
        method: "POST",
        auth: "varun:4aa535f5bab2955f64617af547a3c960-us21"
    };

    const request = https.request(url, options, function (apiResponse) {
        let data = '';

        // A chunk of data has been received.
        apiResponse.on('data', function (chunk) {
            data += chunk;
        });

        // The whole response has been received.
        apiResponse.on('end', function () {
            console.log(JSON.parse(data));

            if(apiResponse.statusCode === 200)  {
                res.sendFile(__dirname+"/failure.html");
            }
            else {
                res.sendFile(__dirname+"/success.html");
            } 
        });
    });

    request.write(jsonData);
    request.end();
});

app.listen( process.env.Port  || 3000, function () {
    console.log("Server runs on 3000");
});

