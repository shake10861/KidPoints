var Kid = require('../models/kid');
var router = require('express').Router();

router.use(function (req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();      
});

router.route("/kids")

    // create a kid (accessed at POST http://localhost/api/kids)
    .post(function (req, res) {
        var kid = new Kid();      // create a new instance of the Kid model
        kid.name = req.body.name; // set the kid's name (comes in from the request)
        kid.accrual = req.body.accrual; // define the accrual rate
        kid.daytotal = req.body.accrual; // starts off with all points. 
        kid.save(function (err) {
            if (err) res.send(err);
            res.json({ message: 'Kid created!' });
        });
    })

    // get all the kids (accessed at GET http://localhost/api/kids)
    .get(function (req, res) {
        Kid.find(function (err, kids) {
            if (err) res.send(err);
            res.json(kids);
        });
    });

router.route("/kids/:kid_id")

    // get the kid with specified ID (accessed at GET http://localhost/api/kids/:kid_id)
    .get(function (req, res) {
        Kid.findById(req.params.kid_id, function (err, kid) {
            if (err) res.send(err);
            res.json(kid);
        });
    })

    // update the kid with this id (accessed at PUT http://localhost/api/kids/:kid_id)
    .put(function (req, res) {
        Kid.findById(req.params.kid_id, function (err, kid) {
            if (err) res.send(err);

            if (req.body.hasOwnProperty("name")) {
                kid.name = req.body.name; // update the kid's information
            }
            
            if (req.body.hasOwnProperty("action")) {
                switch(req.body.action) {
                    case 'credit': kid.credit(req.body.amount, req.body.note); break;
                    case 'debit': kid.debit(req.body.amount, req.body.note); break;
                    case 'clearledger': kid.clearLedger(); break;
                    default: res.send(new Error("Action not found!"));
                }
            }

            // save the kid
            kid.save(function (err) {
                if (err) res.send(err);
                res.json({ message: "Kid updated!" });
            });
        });
    })

    // delete a kid with this id (accessed at DELETE http://localhost/api/kids/:kid_id)
    .delete(function (req, res) {
        Kid.remove({
            _id: req.params.kid_id
        }, function (err, kid) {
            if (err) res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

// BANKING LOOP
function bankAllKids() {
    Kid.find(function (err, kids) {
        if (err) res.send(err);
        for (var k = 0; k < kids.length; k++) {
            var kid = kids[k];
            kid.creditBank();
            kid.save(function (err) {
                if (err) console.log(err);
            });
        }
    });
}
var bankJob = require('node-schedule').scheduleJob("0 0 0 * *", bankAllKids);

router.get("/run/bankjob", function (req, res) {
    bankAllKids();
    res.json({ message: "All kids banked!" });
});

module.exports = router;