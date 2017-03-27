"use strict";

function Item(price) {
    this.isInPromo = false;
    this.currentPrice = price;
    this.originalPrice = price;
    this.lastDateChanged = 0;
    this.promoStarted = 0;
}


Item.prototype.priceChange = function (amount) {

    if (priceChangeWithinRange(amount) && totalPriceReductionDoesNotExceedThreshold.call(this, amount)) {
        if (priceStable.call(this) || !(priceStable.call(this)) && this.promoStarted === true) {
            this.startPromo();
        }
    } else {
        this.endPromo();
    }

    this.reduceBy(amount);
    this.lastDateChanged = new Date();

};

Item.prototype.promoIsActive = function () {
    if (this.promoStarted <= setDateTo31DaysAgo()) {
        this.endPromo();
    }
    return this.isInPromo;
};


Item.prototype.startPromo = function () {
    this.isInPromo = true;
    if (this.promoStarted <= setDateTo31DaysAgo()) {
        this.promoStarted = new Date();
    }
};

Item.prototype.endPromo = function () {
    this.isInPromo = false;
};

Item.prototype.reduceBy = function (amount) {
    this.currentPrice = this.currentPrice * ((1 + amount) * 10) / 10;
};

function priceChangeWithinRange(amount) {
    return amount <= -.05 && amount > -.3;
}

function setDateTo31DaysAgo() {
    let date = new Date();
    date.setDate(date.getDate() - 31);
    return date;
}

function totalPriceReductionDoesNotExceedThreshold(amount) {
    return ((this.originalPrice - this.currentPrice) / this.originalPrice) - amount < .3;
}

function priceStable() {
    return this.lastDateChanged <= setDateTo31DaysAgo();
}
module.exports = Item;
