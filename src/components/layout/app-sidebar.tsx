import Link from "next/link";
import Image from "next/image";

import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { navigation } from "@/data/data";
import { logo } from "@/assets";


const AppSidebar = () => {
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar" className="w-64 h-full p-4">
      <SidebarHeader className="p-0 rounded-t-lg overflow-hidden">
        <SidebarMenu className="p-0">
          <SidebarMenuItem className="p-0 flex items-center justify-center border-b">
            <Link href="/" className="relative w-full h-10 flex items-center justify-center gap-2">
              <Image src={logo} alt="logo" fill className="object-contain" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
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
    </Sidebar>
  );
};

export default AppSidebar;
