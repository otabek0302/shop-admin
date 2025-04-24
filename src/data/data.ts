import { Inbox, Home, Calendar, Search, Settings } from "lucide-react";

// Menu items.
export const navigation = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: Home,
    },
    {
        title: "Products",
        url: "/admin/products",
        icon: Inbox,
    },
    {
        title: "Orders",
        url: "/admin/orders",
        icon: Calendar,
    },
    {
        title: "Categories",
        url: "/admin/categories",
        icon: Search,
    },
    {
        title: "Users",
        url: "/admin/users",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
]