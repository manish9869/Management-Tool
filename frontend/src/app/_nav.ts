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
    icon: "icon-user",
    children: [
      {
        name: "Manage Products",
        url: "/product/manage-product",
        icon: "icon-user-follow",
      },
    ],
  },
  {
    name: "Disabled",
    url: "/dashboard",
    icon: "icon-ban",
    badge: {
      variant: "secondary",
      text: "NEW",
    },
    attributes: { disabled: true },
  },
];
