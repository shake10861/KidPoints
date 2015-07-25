// app/models/kid.js

var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var KidSchema = new Schema({
    name:      { type: String },
    accrual:   { type: Number, default: 10 },
    daytotal:  { type: Number, default: 0 },
    banktotal: { type: Number, default: 0 },
    ledger:    { type: Array, default: [{
                                  transaction_dt_tm: Date, 
                                  type: String,
                                  amt: Number,
                                  note: String
                              }] }
});

KidSchema.methods.credit = function (amt, note) {
    if (amt) this.daytotal += (amt * 1);
    else this.daytotal++;
    this.document(amt, "credit", "DAYBANK", note);
}

KidSchema.methods.debit = function (amt, note) {
    if (amt) this.daytotal -= (amt * 1);
    else this.daytotal--;
    this.document(amt, "debit", "DAYBANK", note);
}

KidSchema.methods.creditBank = function () {
    this.banktotal += (this.daytotal * 1);
    this.document(this.daytotal, "credit", "BANK", "BANK CREDIT");
    this.daytotal = this.accrual;
}

KidSchema.methods.debitBank = function (amt, note) {
    this.banktotal -+ (amt * 1);
    this.document(amt, "debit", "BANK", "BANK DEBIT: " + note);
}

KidSchema.methods.document = function (amt, type, silo, note) {
    this.ledger.push({
        transaction_dt_tm: new Date(),
        silo: (silo) ? silo : "DAYBANK",
        type: type.toLowerCase(),
        amt: (amt) ? amt : 1,
        note: (note) ? note : ""
    });
}

KidSchema.methods.clearLedger = function () {
    this.ledger = [{
        transaction_dt_tm: new Date(),
        silo: "BANK",
        type: "credit",
        amt: this.banktotal,
        note: "Starting Balance"
    }];
}


module.exports = mongoose.model('Kid', KidSchema);