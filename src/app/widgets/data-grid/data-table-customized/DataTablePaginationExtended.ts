import { Component, Inject, forwardRef } from '@angular/core';
import { DataTablePagination } from 'angular-4-data-table/src';
import { PAGINATION_STYLE } from 'angular-4-data-table/src/components/pagination.style';
import { DataTableExtended } from './DataTableExtended';
import { PAGINATION_TEMPLATE_EX } from './pagination.template';


@Component({
  moduleId: module.id,
  selector: 'data-table-pagination',
  template: PAGINATION_TEMPLATE_EX,
  styles: [PAGINATION_STYLE]
})
export class DataTablePaginationExtended extends DataTablePagination {
  constructor(@Inject(forwardRef(() => DataTableExtended)) public dataTable: DataTableExtended) {
    super(dataTable);
  }
}