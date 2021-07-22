import { Injectable } from "@angular/core";

@Injectable()
export class MoneyFormatterService {
    /**
     *
     */

    public format(money, currency?) {
        if (!money) money = 0;
        var number = money.toFixed(2).replace(/./g, function (c, i, a) {
            if (i > 0 && c !== "." && (a.length - i) % 3 === 0) return " " + c + "";
            if (c == ',') return '.';
            return c;
        });
        if (currency)
            number += currency;
        return number;
    }
}