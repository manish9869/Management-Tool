import { INavData } from "@coreui/angular";

export const navItems: INavData[] = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: "icon-speedometer",
    badge: {
      variant: "info",
      text: "NEW",
    },
  },
  {
    title: true,
    name: "Customers",
  },
  {
    name: "Customer",
    url: "",
    icon: "icon-user",
    children: [
      {
        name: "Manage Customer",
        url: "/customer/manage-customer",
        icon: "icon-user-follow",
      },
    ],
  },
  {
    title: true,
    name: "Products",
  },
  {
    name: "Product Master",
    url: "",
    icon: "cil-basket",
    children: [
      {
        name: "Manage Products",
        url: "/product/manage-product",
        icon: "cil-book",
      },
    ],
  },
  {
    title: true,
    name: "Subscription",
  },
  {
    name: "Subscription Master",
    url: "",
    icon: "cil-basket",
    children: [
      {
        name: "Subscription Plan",
        url: "/subscription/manage-subscription",
        icon: "cil-book",
      },{
        name: "Subscription Mapping",
        url: "/subscription/subscription-mapping",
        icon: "cil-book",
      },
    ],
  },
  // {
  //   name: "Disabled",
  //   url: "/dashboard",
  //   icon: "icon-ban",
  //   badge: {
  //     variant: "secondary",
  //     text: "NEW",
  //   },
  //   attributes: { disabled: true },
  // },
];
