import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

declare interface SubRoutes {
  link_name: string;
  link: string;
  icon: string;
}

declare interface RouteInfo {
  link_name: string;
  link: string | null;
  icon: string;
  sub_menu?: SubRoutes[];
  isOpen?: boolean;
}
export const ROUTES: RouteInfo[] = [
  {
    link_name: "Dashboard",
    link: "/dashboard",
    icon: "ni ni-chart-pie-35 text-orange",
    sub_menu: [],
  },
  {
    link_name: "Manage Customer",
    link: null,
    icon: "ni-single-02 text-yellow",
    sub_menu: [
      {
        link_name: "Add Customer",
        link: "/customer/manage-customer",
        icon: "fa-solid fa-user-plus text-primary",
      },
    ],
    isOpen: false,
  },
  {
    link_name: "Auth",
    link: null,
    icon: "ni-bullet-list-67 text-red",
    sub_menu: [
      {
        link_name: "Login",
        link: "/auth/login",
        icon: "ni-bullet-list-67 text-red",
      },
      {
        link_name: "Register",
        link: "/auth/regiter",
        icon: "ni-bullet-list-67 text-red",
      },
    ],
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
  animations: [
    trigger("expandCollapse", [
      state(
        "collapsed",
        style({
          height: "0",
          overflow: "hidden",
          opacity: "0",
        })
      ),
      state(
        "expanded",
        style({
          height: "*",
          overflow: "visible",
          opacity: "1",
        })
      ),
      transition("collapsed <=> expanded", [animate("400ms ease-in-out")]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) {}

  panelHeight = 0;
  toggleAccordion(menuItem: any): void {
    if (menuItem.link === null) {
      menuItem.isOpen = !menuItem.isOpen;
    } else {
      // Redirect to the specified link if it's not null
      this.router.navigate([menuItem.link]);
    }
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
