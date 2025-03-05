const express = require('express');
const app = express();
const Axios = require('axios');
const bodyParser = require('body-parser');
const port = 8080; // You can use any available port
var cors = require('cors')
app.disable('view cache');
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
//app.use(express.urlencoded({ extended: true }));
app.post('/qr/save/transaction', (req, res) => {

    // var md5 = req.body.md5
    // var price = req.body.price
    // var user_id = req.body.user_id
    // db.query('INSERT INTO transaction_pay (hash_md5,price,user_id) VALUES ("' + md5 + '","' + price + '","' + user_id + '")', function (err, output) {
    //     if (err) throw err
    //     res.json({
    //         msg: "Transaction has been saved",
    //         code: 0

    //     })
    // })
    var price = req.body.price
    var user_id = req.body.user_id
    var md5 = req.body.md5
    var chat_id = '693726757';
    var token = '6088240244:AAH3ZkMDYRanrJ-FPu29FNCVe7LZLZb2A1c';
    var text =  'Paid KHQR From User ID  : ' +user_id+ ' Price ' + price +' $ and  HashID : '+req.body.md5;
    //     const TelegramBot = require('node-telegram-bot-api');
    //     const bot = new TelegramBot(token, {polling: true});
    //     bot.sendMessage(chat_id, 'Hello Paid KHQR From User ID  : ' +user_id+ ' Price ' + price +' Hash '+req.body.md5 );

    // Axios.get('http://api.camfeed.net/sendbot/'+price+'/'+user_id+'/'+md5,)
    // res.json({
    //     msg: "Transaction has been saved",
    //     code: 0

    // })

    let config = {
        method: 'post',
        url: 'https://api.telegram.org/bot' + token + '/sendMessage?text=' + text + '&chat_id=' + chat_id,
        headers: {
            'Content-Type': 'application/json',

        },

    };

    Axios.request(config)
        .then((response) => {

            res.json({
                msg: "Transaction has been saved",
                code: 0

            })



        })
        .catch((error) => {
            console.log(error);
        });

})


app.get('/pay_qr', (req, res) => {
    var price = req.query.price
    if (price == undefined) {

        res.json({
            msg: "Price Underfined",
            code: 1

        })

    } else if (price == 2 || price == 3 || price == 5 || price == 15 || price == 10) {

        const {
            BakongKHQR,
            khqrData,
            IndividualInfo,
            MerchantInfo,
            SourceInfo
        } = require("bakong-khqr");
        const optionalData = {
            currency: khqrData.currency.usd,
            amount: price,
            accountInformation: "855969872209",
            acquiringBank: "Cam Bank",
            mobileNumber: "855969872209",
            storeLabel: "Cam Tool",
        };
        const individualInfo = new IndividualInfo(
            "sieng_roeun@aclb",
            "Sieng Roeun",
            "BATTAMBANG",
            optionalData);
        const KHQR = new BakongKHQR();
        const individual = KHQR.generateIndividual(individualInfo);
        md5_en = individual.data.md5
        var tokenBakong = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiN2NhZTFhNTdmOTk4NDNkIn0sImlhdCI6MTc0MTA3MjI2MSwiZXhwIjoxNzQ4ODQ4MjYxfQ.jHlu2i8T_6deKnoMaI5KPgZwHpK6ndWMJGoP4j1AbPs";

        res.json({
            qr: individual.data.qr,
            md5: individual.data.md5,
            code: 0,
            bakong_token: tokenBakong

        })


    } else {

        res.json({
            msg: "This price not suppport",
            code: 1

        })

    }



});
app.post('/check/transaction', (req, res) => {
    //console.log(req.body)

    let dataMD5 = JSON.stringify({
        md5: req.body.md5
    });
    var tokenBakong = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImlkIjoiN2NhZTFhNTdmOTk4NDNkIn0sImlhdCI6MTc0MTEzODE4OCwiZXhwIjoxNzQ4OTE0MTg4fQ.TH7Vk7EDkNSEPXYZNSKBX9vNKfvnCib08VRfOGMf3FM";

    let config = {
        method: 'post',
        url: 'https://api-bakong.nbc.gov.kh/v1/check_transaction_by_md5',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenBakong}`

        },
        data: dataMD5
    };

    Axios.request(config)
        .then((response) => {
            //   console.log(JSON.stringify(response.data));


            if (response.data.responseCode == 0) {

                res.json({
                    msg: response.data.responseMessage,
                    code: response.data.responseCode
                })

            } else {
                res.json({
                    msg: response.data.responseMessage,
                    code: response.data.responseCode
                })
            }

        })
        .catch((error) => {
            console.log(error);
        });
});
app.get('/', (req, res) => {
    // Add Commit New
    res.end('Welcome To Cam-Tool\n');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

