import { Component, Inject, forwardRef } from '@angular/core';
import { HEADER_STYLE } from 'angular-4-data-table/src/components/header.style';
import { DataTableHeader } from 'angular-4-data-table/src';
import { HEADER_TEMPLATE_EXT } from './header.template';
import { DataTableExtended } from './DataTableExtended';


@Component({
  moduleId: module.id,
  selector: 'data-table-header',
  template: HEADER_TEMPLATE_EXT,
  styles: [HEADER_STYLE],
  host: {
    '(document:click)': '_closeSelector()'
  }
})
export class DataTableHeaderExtended extends DataTableHeader {

  constructor(@Inject(forwardRef(() => DataTableExtended)) public dataTable: DataTableExtended) {
    super(dataTable);
  }
}
