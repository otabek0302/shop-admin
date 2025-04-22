import { Inbox, Home, Calendar, Search, Settings } from "lucide-react";

// Menu items.
export const navigation = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
    },
    {
        title: "Products",
        url: "/products",
        icon: Inbox,
    },
    {
        title: "Orders",
        url: "/orders",
        icon: Calendar,
    },
    {
        title: "Customers",
        url: "/customers",
        icon: Search,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
]