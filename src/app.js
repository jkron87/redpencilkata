"use strict";

function Item(price) {
    this.isInPromo = false;
    this.currentPrice = price;
    this.originalPrice = price;
    this.lastDateChanged = setDateTo31DaysAgo();
    this.promoStarted = setDateTo31DaysAgo();
}

Item.prototype.priceChange = function (amount) {
    let priceChangeWithinRange = amount <= -.05 && amount > -.3;
    let priceStable = this.lastDateChanged <= setDateTo31DaysAgo();
    let totalReductionDoesNotExceedThreshold = (((this.originalPrice - this.currentPrice) / this.originalPrice) - amount) < .3;

    this.lastDateChanged = new Date();
    this.reduceBy(amount);

    if (priceChangeWithinRange && totalReductionDoesNotExceedThreshold && priceStable) {
        this.startPromo();
    } else if (!priceStable && this.promoStarted > setDateTo31DaysAgo() && totalReductionDoesNotExceedThreshold){
        this.startPromo();
    } else {
        this.endPromo();
    }
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

function setDateTo31DaysAgo() {
    let date = new Date();
    date.setDate(date.getDate() - 31);
    return date;
}

module.exports = Item;