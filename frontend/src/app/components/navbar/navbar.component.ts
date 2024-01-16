import { Component, OnInit, ElementRef } from "@angular/core";
import { titleRoutes } from "../sidebar/sidebar.component";
import {
  Location,
  LocationStrategy,
  PathLocationStrategy,
} from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  public focus;
  public listTitles: any[];
  public location: Location;
  constructor(
    location: Location,
    private element: ElementRef,
    private router: Router
  ) {
    this.location = location;
  }

  ngOnInit() {
    this.listTitles = titleRoutes.filter((listTitle) => listTitle);
  }
  getTitle() {
    var titlee = this.location.prepareExternalUrl(this.location.path());

    if (titlee.charAt(0) === "#") {
      titlee = titlee.slice(1).split("?")[0];
    }

    const titleName = this.findNestedObj(this.listTitles, "link", titlee);

    if (titleName != "" || undefined) {
      return titleName.link_name;
    }

    return "Dashboard";
  }

  findNestedObj(entireObj, keyToFind, valToFind) {
    let foundObj;
    JSON.stringify(entireObj, (_, nestedValue) => {
      if (nestedValue && nestedValue[keyToFind] === valToFind) {
        foundObj = nestedValue;
      }
      return nestedValue;
    });
    return foundObj;
  }
}
