// Author: T4professor

import { Component } from "@angular/core";
import { ICellRendererAngularComp } from "ag-grid-angular";

@Component({
  selector: "app-button-renderer",
  template: `
    <div class="row justify-content-center">
      <span class="icon-space"
        ><i
          class="fa-solid fa-download"
          (click)="onClick($event, 'download')"
          style="color:#113a5a"
        ></i
      ></span>
      <span class="icon-space"
        ><i
          class="fa-solid fa-magnifying-glass"
          (click)="onClick($event, 'view')"
          style="color:#ffd600"
        ></i
      ></span>
      <span class="icon-space"
        ><i
          class="fa-solid fa-pen-to-square"
          (click)="onClick($event, 'edit')"
          style="color:#5e72e4"
        ></i
      ></span>
      <span class="icon-space"
        ><i
          class="fa-solid fa-trash"
          (click)="onClick($event, 'delete')"
          style="color:#fb6340"
        ></i
      ></span>
    </div>
  `,
  styles: [
    `
      .icon-space {
        margin: 15px;
        cursor: pointer;
      }
    `,
  ],
})
export class InvoiceDownloadRendererComponent
  implements ICellRendererAngularComp
{
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
