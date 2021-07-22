// import { HEADER_TEMPLATE } from './header.template';
// import { HEADER_STYLE } from "./header.style";

import { DataTable, DataTableColumn, DataTableRow, RowCallback, DataTablePagination, DataTableTranslations, DataTableParams, CellCallback, defaultTranslations } from 'angular-4-data-table/src';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PixelConverter } from 'angular-4-data-table/src/utils/px';
import { Hide } from 'angular-4-data-table/src/utils/hide';
import { MinPipe } from 'angular-4-data-table/src/utils/min';
import { DataTableHeaderExtended } from './data-table-header-extended';
import { DataTableRowExtended } from './DataTableRowExtended';
import { DataTablePaginationExtended } from './DataTablePaginationExtended';
import { DataTableExtended } from './DataTableExtended';

export {
    DataTableExtended, DataTableColumn, DataTableRow, DataTablePagination,
    DataTableHeaderExtended, DataTableTranslations, CellCallback, RowCallback, DataTableParams, defaultTranslations
};
export const DATA_TABLE_DIRECTIVES = [DataTableExtended, DataTableColumn];


@NgModule({
    imports: [CommonModule, FormsModule],
    declarations: [
        DataTableExtended, DataTableColumn,
        DataTableRowExtended, DataTablePaginationExtended, DataTableHeaderExtended,
        PixelConverter, Hide, MinPipe
    ],
    exports: [ DataTableExtended, DataTableColumn ],
    providers: [DataTable, DataTableColumn, DataTableRow, DataTablePagination]
})
export class DataTableModuleExtended { }
