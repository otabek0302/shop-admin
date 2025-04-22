import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { navigation } from "@/data/data";
import { logo } from "@/assets";

import Link from "next/link";
import Image from "next/image";
import { LogOut } from "lucide-react";

const AppSidebar = () => {
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" className="w-64 p-4">
      <SidebarHeader className="p-0 rounded-t-lg overflow-hidden">
        <SidebarMenu className="p-0">
          <SidebarMenuItem className="p-0 flex items-center justify-center border-b">
            <Link href="/" className="relative w-full h-13 flex items-center justify-center gap-2">
              <Image src={logo} alt="logo" fill className="object-contain" />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="p-0 py-2 rounded-b-lg overflow-hidden">
        <SidebarMenu>
          {navigation.map((item, index) => (
            <SidebarMenuItem key={index} className="p-0">
              <SidebarMenuButton asChild size="sm" className="py-5">
                <Link href={item.url}>
                  <item.icon className="h-9 w-9 text-primary" />
                  <span className="text-sm font-semibold">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-0">
        <SidebarMenu>
          <SidebarMenuItem className="p-0">
            <SidebarMenuButton asChild size="sm" className="py-5">
              <Link href="/">
                <LogOut className="h-9 w-9 text-primary" />
                <span className="text-sm font-semibold">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
