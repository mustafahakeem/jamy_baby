import { Pipe, PipeTransform } from '@angular/core';
import { MoneyFormatterService } from '../services/moneyFormatter.service';

@Pipe({ name: 'formatMoney' })
export class MoneyFormatter implements PipeTransform {

    /**
     *
     */
    constructor(private moneyFormatterService: MoneyFormatterService) {

    }

    transform(money: number): string { 
        return this.moneyFormatterService.format(money);
    }
}

