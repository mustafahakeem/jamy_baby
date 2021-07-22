import { Component, Output, EventEmitter } from '@angular/core';
import { DataTable } from 'angular-4-data-table/src';
import { TABLE_TEMPLATE_EX } from './table.template';
import { TABLE_STYLE } from 'angular-4-data-table/src/components/table.style';
@Component({
    moduleId: module.id,
    selector: 'data-table-extended',
    template: TABLE_TEMPLATE_EX,
    styles: [TABLE_STYLE]
})

export class DataTableExtended extends DataTable {
    pagination_range: boolean = true;
    pagination_limit: boolean = true;
    pagination_input: boolean = true;
    pagination_numbers: boolean = false;

    constructor() {
        super();
        }

    @Output() refresh = new EventEmitter();

    onRefresh = function () {
        this.refresh.emit(this._getRemoteParameters());
    }
}
