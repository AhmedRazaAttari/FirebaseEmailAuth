const express = require('express');
const router = express.Router();
var admin = require("firebase-admin");
var nodeMailer = require('nodemailer');
var cors = require('cors');
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://vidoe-51f03-default-rtdb.firebaseio.com"
});
var db = admin.database();

router.get("/getSteps", cors({
    origin: ['http://localhost:3000', 'https://vidoe-51f03.web.app', 'https://www.google.com', 'https://halelujjahgospellivestreaming.herokuapp.com'],
    methods: ['GET', 'POST']
}), async (req, res) => {
    db.ref("steps").once("value").then((snapshot) => {
        res.send(snapshot);
    })
})

router.post("/DeleteStep", cors({
    origin: ['http://localhost:3000', 'https://vidoe-51f03.web.app', 'https://www.google.com', 'https://halelujjahgospellivestreaming.herokuapp.com'],
    methods: ['GET', 'POST']
}), async (req, res) => {
    db.ref("steps/" + req.body.stepName).remove()
        .then(function () {
            return res.status(200).json({
                message: "data deleted"
            })
        })
        .catch(function (error) {
            return res.status(500).json({
                error
            })
        });
})


router.post("/AddSteps", cors({
    origin: ['http://localhost:3000', 'https://vidoe-51f03.web.app', 'https://www.google.com', 'https://halelujjahgospellivestreaming.herokuapp.com'],
    methods: ['GET', 'POST']
}), async (req, res) => {
    db.ref("steps/" + req.body.stepName).push({
        createdDateTime: Date()
    }).then(() => {
        return res.status(200).json({
            message: "data deleted"
        })
    })
})


router.get("/set/:setId/mintElement", cors({
    origin: ['http://localhost:3000', 'https://vidoe-51f03.web.app', 'https://www.google.com', 'https://halelujjahgospellivestreaming.herokuapp.com'],
    methods: ['GET', 'POST']
}), async (req, res) => {
    var step = req.params.setId;
    var stepName;
    if (step.indexOf(':') !== -1) {
        var stepName = step.split(':')[1];
    }

    db.ref("steps/" + stepName).child("followers").once("value", function (snapshot) {
        var loopend = false;
        var increment = 1;
        if (snapshot.exists()) {
            snapshot.forEach(function (childSnapshot) {
                console.log(snapshot.val.length);
                console.log(childSnapshot.val());

                increment + 1;
                let transporter = nodeMailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: 'Ahmedrazaattari536@gmail.com',
                        pass: 'oggdhfljpztxvlli'
                    }
                });
                let mailOptions = {
                    from: '"Sample Project" <Online.freelancer536@gmail.com>', // sender address
                    to: childSnapshot.val().useremail,
                    subject: `Update data!`,
                    html: `<div style="padding : 20px;">
                    <br>
                        <h2 style="color : black; font-weight : bold;">Data update in your followed step : ${stepName}</h2>
                        <br>
                        <p style="font-size : 18px; font-family : Arial; color : black;">Hi</p>
                        
                        <small style="font-size : 15px; color : black; font-family : Arial;">you received this email because you followed steps :)</small>
                    </div>`,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return res.status(404).json({
                            message: error
                        })
                    }
                    if (info) {
                        console.log(increment);
                        console.log(snapshot.numChildren());

                        if (increment == snapshot.numChildren()) {
                            loopend = true;
                            return res.status(200).json({
                                message: "process done"
                            })
                        }
                    }
                })

            })
            if (loopend) {
                // return res.status(200).json({
                //     message: "process done"
                // })
            }
        }
        else {
            return res.status(200).json({
                message: "not found"
            })
        }

    })
})

router.post("/updateSteps", cors({
    origin: ['http://localhost:3000', 'https://vidoe-51f03.web.app', 'https://www.google.com', 'https://halelujjahgospellivestreaming.herokuapp.com'],
    methods: ['GET', 'POST']
}), async (req, res) => {
    db.ref("steps/" + req.body.stepName).push({
        text: req.body.text
    }).then(() => {
        db.ref("steps/" + req.body.stepName).child("followers").once("value", function (snapshot) {
            var loopend = false;
            var increment = 1;
            if (snapshot.exists()) {
                snapshot.forEach(function (childSnapshot) {
                    console.log(snapshot.val.length);
                    console.log(childSnapshot.val());

                    increment + 1;
                    let transporter = nodeMailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: 'Ahmedrazaattari536@gmail.com',
                            pass: 'oggdhfljpztxvlli'
                        }
                    });
                    let mailOptions = {
                        from: '"Sample Project" <Online.freelancer536@gmail.com>', // sender address
                        to: childSnapshot.val().useremail,
                        subject: `Update data!`,
                        html: `<div style="padding : 20px;">
                        <br>
                            <h2 style="color : black; font-weight : bold;">Data update in your followed step : ${req.body.stepName}</h2>
                            <br>
                            <p style="font-size : 18px; font-family : Arial; color : black;">Hi</p>
                            
                            <small style="font-size : 15px; color : black; font-family : Arial;">you received this email because you followed steps.. you can customize when you want to receive email :)</small>
                        </div>`,
                    };

                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return res.status(404).json({
                                message: error
                            })
                        }
                        if (info) {
                            console.log(increment);
                            console.log(childSnapshot.val.length)

                            if (increment === snapshot.val.length) {
                                loopend = true;
                            }
                        }
                    });

                })
                if (loopend) {
                    return res.status(200).json({
                        message: "process done"
                    })
                }
            }
            else {
                return res.status(200).json({
                    message: "process done"
                })
            }

        })
    })
})

router.post("/followSteps", cors({
    origin: ['http://localhost:3000', 'https://vidoe-51f03.web.app', 'https://www.google.com', 'https://halelujjahgospellivestreaming.herokuapp.com'],
    methods: ['GET', 'POST']
}), async (req, res) => {
    var loopend = false;
    for (var i = 0; i < req.body.stepName.length; i++) {
        db.ref("steps/" + req.body.stepName[i]).child("followers/" + req.body.userid).update({
            userid: req.body.userid,
            useremail: req.body.useremail
        })
        if (i === req.body.stepName.length - 1) {
            loopend = true;
        }
    }
    if (loopend) {
        return res.status(200).json({
            message: "data updated"
        })
    }
})

module.exports = router;