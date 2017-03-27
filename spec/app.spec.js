'use strict';
const Item = require('../src/app');

describe("The red pencil promotion", () => {


    it("Should be active if price drop is greater than or equal to 5%", () => {
        let item = new Item(10);

        item.priceChange(-.05);

        expect(item.isInPromo).toBe(true);
    });

    it("Price change reduces current price by appropriate amount", () => {
        let item = new Item(10);
        let item2 = new Item(10);
        let item3 = new Item(10);

        item.priceChange(-.05);
        item2.priceChange(0);
        item3.priceChange(-1);

        expect(item.currentPrice).toBe(9.50);
        expect(item2.currentPrice).toBe(10);
        expect(item3.currentPrice).toBe(0);
    });

    it("Should not be active if price drop is less than 5%", () => {
        let item = new Item(10);

        item.priceChange(-.04);

        expect(item.isInPromo).toBe(false);
    });

    it("Should not be active if individual price drop is more than 30%", () => {
        let item = new Item(10);

        item.priceChange(-.31);

        expect(item.isInPromo).toBe(false);
    });

    it("Should not be active if price drops accumulate to more than 30%", () => {
        let item = new Item(10);

        item.priceChange(-.20);
        item.priceChange(-.20);

        expect(item.promoIsActive()).toBe(false);
    });

    it("Should be active if price drops accumulate to less than 30%", () => {
        let item = new Item(10);

        item.priceChange(-.10);
        item.priceChange(-.10);

        expect(item.promoIsActive()).toBe(true);
    });

    it("A price change should record date changed", () => {
        let item = new Item(10);

        item.priceChange(-.2);

        expect(item.lastDateChanged.getDay()).toBe(new Date().getDay());
    });

    it("Should not be active if price has changed in last 30 days", () => {
        let item = new Item(10);

        let date = new Date();
        item.lastDateChanged = date.setDate(date.getDate() - 1);

        item.priceChange(-.2);

        expect(item.isInPromo).toBe(false);
    });


    it("Should be active if price has not changed in last 30 days", () => {
        let item = new Item(10);

        let date = new Date();
        item.lastDateChanged = date.setDate(date.getDate() - 40);
        item.priceChange(-.2);

        expect(item.isInPromo).toBe(true);
    });



    it("Should record date promo is started for an item", () => {
        let item = new Item(10);

        item.priceChange(-.2);

        expect(item.promoStarted.getDay()).toBe(new Date().getDay());
    });

    it("Should not last longer than 30 days", () => {
        let item1 = new Item(10);
        let item2 = new Item(10);

        item1.priceChange(-.1);
        item2.priceChange(-.1);

        let date = new Date();
        item1.promoStarted = date.setDate(date.getDate() - 31);

        date = new Date();
        item2.promoStarted = date.setDate(date.getDate() - 30);

        expect(item1.promoIsActive()).toBe(false);
        expect(item2.promoIsActive()).toBe(true);

    });

    it("A second price reduction should not prolong promotion", () => {
        let item = new Item(10);

        let date = new Date();
        date.setDate(date.getDate() - 10);
        item.promoStarted = date;

        item.priceChange(-.1);

        expect(item.promoStarted).toBe(date);
    });

    it("Should end if price increases", () => {
        let item = new Item(10);

        this.isInPromo = true;

        let date = new Date();
        item.promoStarted = date.setDate(date.getDate() - 20);


        item.priceChange(.1);

        expect(item.promoIsActive()).toBe(false);
    });


});

