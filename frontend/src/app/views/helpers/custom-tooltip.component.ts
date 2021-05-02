import { Component } from "@angular/core";
import { ITooltipParams } from "@ag-grid-community/core";
import { ITooltipAngularComp } from "@ag-grid-community/angular";

@Component({
  selector: "tooltip-component",
  template: ` <div class="custom-tooltip" [style.background-color]="color">
    <p>
      <span>User Details</span>
    </p>
    <p><span>Full name: </span>{{ data.fullname }}</p>
    <p><span>Email: </span>{{ data.email }}</p>
    <p><span>DOB: </span>{{ data.DOB }}</p>
    <p><span>Address: </span>{{ data.address }}</p>
  </div>`,
  styles: [
    `
      :host {
        position: absolute;
        width: 200px;
        height: 70px;
        pointer-events: none;
        transition: opacity 1s;
      }

      :host.ag-tooltip-hiding {
        opacity: 0;
      }

      .custom-tooltip p {
        margin: 5px;
        white-space: nowrap;
      }

      .custom-tooltip p:first-of-type {
        font-weight: bold;
      }
    `,
  ],
})
export class CustomTooltip implements ITooltipAngularComp {
  private params: { color: string } & ITooltipParams;
  private data: any[];
  private color: string;

  agInit(params: { color: string } & ITooltipParams): void {
    this.params = params;

    this.data = params.api.getDisplayedRowAtIndex(params.rowIndex).data;
    this.color = this.params.color || "white";
  }
}
