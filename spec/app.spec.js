'use strict';
const Item = require('../src/app');

describe("The red pencil promotion", () => {

    it("Should default to promotion not being active", () => {
        let item = new Item(10);

        expect(item.isInPromo).toBe(false);
    });

    it("Should be active if price drop is greater than or equal to 5%", () => {
        let item = new Item(10);

        item.priceChange(-.05);

        expect(item.currentPrice).toBe(9.50);
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
        expect(item.isInPromo).toBe(false);
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

        let date = new Date();
        date.setDate(date.getDate() - 31);
        item1.promoStarted = date;

        let date2 = new Date();
        date2.setDate(date2.getDate() - 30);
        item2.promoStarted = date2;

        expect(item1.promoIsActive()).toBe(false);
        expect(item2.promoIsActive()).toBe(true);

    });


});

