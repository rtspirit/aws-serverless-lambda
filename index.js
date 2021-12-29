var aws = require("aws-sdk");
var crypt = require('crypto');
var ses = new aws.SES({ region: "us-east-1" });
var DynamoDB = new aws.DynamoDB.DocumentClient();

require('dotenv').config();

exports.handler = (event, context, callback) => {

    let message = JSON.parse(event.Records[0].Sns.Message);

    let SHA= crypt.createHash('sha256');
    SHA.update(combination);
    let HASH = SHA.digest('hex');

    let searchParams = {
        TableName: "csye6225",
        Key: {
            "id": HASH
        }
    };

    DynamoDB.get(searchParams, function(error, record){
        
        if(error) {

            console.log("Error in DynamoDB get method ",error);

        } else {

            console.log("Success in get method dynamoDB", record);
            console.log(JSON.stringify(record));
            let isPresent = false;

            if (record.Item == null || record.Item == undefined) {
                isPresent = false;
            } else {
                if(record.Item.ttl < Math.floor(Date.now() / 1000))
                    isPresent = false;
                else
                    isPresent = true;
            }

            if(!isPresent) {
                const current = Math.floor(Date.now() / 1000)
                let ttl = 60 * 5
                const expiresIn = ttl + current
                const params = {
                    Item: {
                        email_hash: HASH,
                        ttl: expiresIn,
                        time_created: new Date().getTime(),
                    },
                    TableName: "csye6225"
                }

                DynamoDB.put(params, function (error, data) {
                    if (error){
                        console.log("Error in putting item in DynamoDB ", error);
                    } 
                    else {
                        sendEmail(message, question, answer);
                    }
                });
                
            } else {
                console.log("Item already present. No email sent!");
            }
        }
    })
};

var sendEmail = (data, question, answer) => {


    let from = "no-reply@"+process.env.DOMAIN
    let emailParams = {
        Destination: {
            ToAddresses: [data.ToAddresses.username],
        },
        Message: {
            Body: {
                Text: { Data: body },
            },
            Subject: { Data: "Email Notification" },
        },
        Source: from,
    };

    let sendEmailPromise = ses.sendEmail(emailParams).promise()
    sendEmailPromise
        .then(function(result) {
            console.log(result);
        })
        .catch(function(err) {
            console.error(err, err.stack);
        });
}