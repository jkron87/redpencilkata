"use strict";
function Item(price) {
    this.isInPromo = false;
    this.currentPrice = price;
    this.originalPrice = price;
    this.lastDateChanged = setDateTo31DaysAgo();
    this.promoStarted = setDateTo31DaysAgo();
}

Item.prototype.priceChange = function (amount) {
    let priceChangeWithinRange = amount <= -.05 && amount > -.3 ;
    let priceStable = this.lastDateChanged <= setDateTo31DaysAgo();
    let totalReductionDoesNotExceedThreshold = (((this.originalPrice - this.currentPrice) / this.originalPrice) - amount) < 3;

    this.lastDateChanged = new Date();
    this.reduceBy(amount);

    if (priceChangeWithinRange && priceStable && totalReductionDoesNotExceedThreshold) {
        this.startPromo();
    } else {
        this.endPromo();
    }
};

Item.prototype.startPromo = function() {
    this.isInPromo = true;
    this.promoStarted = new Date();
};

Item.prototype.endPromo = function () {
    this.isInPromo = false;
};

Item.prototype.reduceBy = function (amount) {
    this.currentPrice = this.currentPrice * ((1 + amount) * 10) / 10;
};

function setDateTo31DaysAgo () {
    let date = new Date();
    date.setDate(date.getDate() - 31);
    return date;
}

module.exports = Item;