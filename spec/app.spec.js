'use strict';
const Item = require('../src/app');

describe("The red pencil promotion", () => {


    it("Should be active if price drop is greater than or equal to 5%", () => {
        let item = new Item(10);

        item.priceChange(-.05);

        expect(item.currentPrice).toBe(9.50);
        expect(item.originalPrice).toBe(10);
        expect(item.isInPromo).toBe(true);
    });

    it("Should not be active if price drop is less than 5%", () => {
        let item = new Item(10);

        item.priceChange(-.04);

        expect(item.currentPrice).toBe(9.6);
        expect(item.isInPromo).toBe(false);
    });

    it("Should not be active if individual price drop is more than 30%", () => {
        let item = new Item(10);

        item.priceChange(-.31);

        expect(item.currentPrice).toBe(6.9);
        expect(item.isInPromo).toBe(false);
    });

    it("Should not be active if price drops accumulate to more than 30%", () => {
        let item = new Item(10);

        item.priceChange(-.20);
        item.priceChange(-.20);

        expect(item.currentPrice).toBe(6.4);
        expect(item.originalPrice).toBe(10);
        expect(item.promoIsActive()).toBe(false);
    });

    it("Should be active if price drops accumulate to less than 30%", () => {
        let item = new Item(10);

        item.priceChange(-.10);
        item.priceChange(-.10);

        expect(item.currentPrice).toBe(8.1);
        expect(item.originalPrice).toBe(10);
        expect(item.promoIsActive()).toBe(true);
    });

    it("A price change should record date changed", () => {
        let item = new Item(10);

        item.priceChange(-.2);

        expect(item.lastDateChanged.getDay()).toBe(new Date().getDay());
    });

    it("Should not be active if price has not been stable in last 30 days", () => {
        let item = new Item(10);

        let date = new Date();
        date.setDate(date.getDate() - 1);
        item.lastDateChanged = date;
        item.priceChange(-.2);

        expect(item.isInPromo).toBe(false);
    });

    it("Should be active if price has been stable in last 30 days", () => {
        let item = new Item(10);

        let date = new Date();
        date.setDate(date.getDate() - 40);
        item.lastDateChanged = date;
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
        let item3 = new Item(10);

        item1.priceChange(-.1);
        item2.priceChange(-.1);
        item3.priceChange(-.1);

        let date = new Date();
        date.setDate(date.getDate() - 31);
        item1.promoStarted = date;

        let date2 = new Date();
        date2.setDate(date2.getDate() - 30);
        item2.promoStarted = date2;

        let date3 = new Date();
        date3.setDate(date3.getDate() - 20);
        item3.promoStarted = date3;

        expect(item1.promoIsActive()).toBe(false);
        expect(item2.promoIsActive()).toBe(true);
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
        date.setDate(date.getDate() - 20);
        item.promoStarted = date;

        item.priceChange(.1);

        expect(item.promoIsActive()).toBe(false);
    });



});

