// Author: T4professor

import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: "app-button-renderer",
  template: `
    <div class="row">
      <span
        class="cil-zoom icon-space"
        (click)="onClick($event, 'select')"
      ></span>
      <span
        class="icon-pencil icon-space"
        (click)="onClick($event, 'edit')"
      ></span>
      <span
        class="icon-trash icon-space"
        (click)="onClick($event, 'delete')"
      ></span>
    </div>
  `,
  styles: [
    `
      .icon-space {
        margin: 7px;
        cursor: pointer;
      }
    `,
  ],
})
export class ButtonRendererComponent implements ICellRendererAngularComp {
  params;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event, type) {
    if (this.params.onClick instanceof Function) {
      // put anything into params u want pass into parents component
      const params = {
        event: $event,
        type: type,
        rowData: this.params.node.data,
        // ...something
      };
      this.params.onClick(params);
    }
  }
}
