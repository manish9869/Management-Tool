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
    icon: "ni ni-chart-pie-35 text-red",
    sub_menu: [],
  },
  {
    link_name: "Customer Appointment",
    link: "/customer/customer-appointment",
    icon: "fa-solid fa-calendar-check text-indigo",
    sub_menu: [],
  },
  {
    link_name: "Reminder",
    link: "/reminder",
    icon: "fa-solid fa-bell text-green",
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
      {
        link_name: "View Customer",
        link: "/customer/view-customer",
        icon: "fa-solid fa-user-plus text-primary",
      },
      {
        link_name: "Add Case History",
        link: "/customer/case-history",
        icon: "fa-solid fa-user-plus text-primary",
      },
      {
        link_name: "Manage Invoice",
        link: "/customer/manage-invoice",
        icon: "fa-solid fa-user-plus text-primary",
      },
    ],
    isOpen: false,
  },
  {
    link_name: "Manage Staff",
    link: null,
    icon: "fa-solid fa-user-nurse text-teal",
    sub_menu: [
      {
        link_name: "Add Staff Members",
        link: "/staff/manage-staff-members",
        icon: "fa-solid fa-user-plus text-primary",
      },
    ],
    isOpen: false,
  },
  {
    link_name: "Manage Expense",
    link: null,
    icon: "fa-solid fa-receipt text-purple",
    sub_menu: [
      {
        link_name: "Add Expense",
        link: "/expense/manage-expense-tracker",
        icon: "fa-solid fa-user-plus text-primary",
      },
      {
        link_name: "View Expense",
        link: "/expense/view-expense",
        icon: "fa-solid fa-user-plus text-primary",
      },
      {
        link_name: "Revenue Tracking",
        link: "/expense/revenue-tracker",
        icon: "fa-solid fa-user-plus text-primary",
      },
    ],
    isOpen: false,
  },
  {
    link_name: "Master Data",
    link: null,
    icon: "fa-solid fa-database text-danger",
    sub_menu: [
      {
        link_name: "Medical Condition",
        link: "/master-data/medical-condition",
        icon: "fa-solid fa-user-plus text-primary",
      },
      {
        link_name: "Treatment",
        link: "/master-data/treatment",
        icon: "fa-solid fa-user-plus text-primary",
      },
      {
        link_name: "Medicine",
        link: "/master-data/medicine",
        icon: "fa-solid fa-user-plus text-primary",
      },
    ],
    isOpen: false,
  },
  {
    link_name: "Auth",
    link: null,
    icon: "fa-solid fa-shield-halved text-red",
    sub_menu: [
      {
        link_name: "Login",
        link: "/auth/login",
        icon: "ni-bullet-list-67 text-red",
      },
      {
        link_name: "Register",
        link: "/auth/register",
        icon: "ni-bullet-list-67 text-red",
      },
    ],
  },
];

export const titleRoutes = [
  {
    link_name: "Dashboard",
    link: "/dashboard",
    sub_menu: [],
  },
  {
    link_name: "Customer Appointment",
    link: "/customer/customer-appointment",
    sub_menu: [],
  },
  {
    link_name: "Reminder",
    link: "/reminder",
    sub_menu: [],
  },
  {
    link_name: "Manage Customer",
    link: null,
    sub_menu: [
      {
        link_name: "Add Customer",
        link: "/customer/manage-customer",
      },
      {
        link_name: "View Customer",
        link: "/customer/view-customer",
      },
      {
        link_name: "Add Case History",
        link: "/customer/case-history",
      },
      {
        link_name: "View Case History",
        link: "/customer/view-case-history",
      },
      {
        link_name: "Manage Invoice",
        link: "/customer/manage-invoice",
      },
    ],
  },
  {
    link_name: "Manage Staff",
    link: null,
    sub_menu: [
      {
        link_name: "Add Staff Members",
        link: "/staff/manage-staff-members",
      },
      {
        link_name: "View Staff Members",
        link: "/staff/view-staff-members",
      },
    ],
  },
  {
    link_name: "Manage Expense",
    link: null,
    icon: "fa-solid fa-receipt text-purple",
    sub_menu: [
      {
        link_name: "Add Expense",
        link: "/expense/manage-expense-tracker",
      },
      {
        link_name: "View Expense",
        link: "/expense/view-expense",
      },
      {
        link_name: "Revenue Tracking",
        link: "/expense/revenue-tracker",
      },
    ],
  },
  {
    link_name: "Master Data",
    link: null,
    sub_menu: [
      {
        link_name: "Medical Condition",
        link: "/master-data/medical-condition",
      },
      {
        link_name: "Treatment",
        link: "/master-data/treatment",
      },
      {
        link_name: "Medicine",
        link: "/master-data/medicine",
      },
    ],
  },
  {
    link_name: "Auth",
    link: null,
    sub_menu: [
      {
        link_name: "Login",
        link: "/auth/login",
      },
      {
        link_name: "Register",
        link: "/auth/register",
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
