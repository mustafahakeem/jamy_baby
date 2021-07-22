import {
    Component, Input, Inject, forwardRef, Output, EventEmitter, OnDestroy
} from '@angular/core';
import { DataTableRow } from 'angular-4-data-table/src';
import { ROW_STYLE } from 'angular-4-data-table/src/components/row.style';
import { DataTableExtended } from './DataTableExtended';
import { ROW_TEMPLATE_EX } from './row.template';

@Component({
    moduleId: module.id,
    selector: '[dataTableRow]',
    template: ROW_TEMPLATE_EX,
    styles: [ROW_STYLE]
})
export class DataTableRowExtended extends DataTableRow {
    constructor(@Inject(forwardRef(() => DataTableExtended)) public dataTable: DataTableExtended) {
        super(dataTable);
    }
}