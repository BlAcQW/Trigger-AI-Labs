
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { History, Settings, ShieldCheck, Video } from 'lucide-react';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Separator } from '@/components/ui/separator';
import { Button } from '../ui/button';

export function SidebarNav() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className="h-16 justify-center p-4">
          <div className="flex w-full items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="group-data-[collapsible=icon]:pointer-events-none group-data-[collapsible=icon]:-ml-1"
              asChild
            >
              <Link href="/dashboard">
                <ShieldCheck className="text-primary" />
                <span className="sr-only">TriggerTalk</span>
              </Link>
            </Button>
            <h1 className="text-lg font-semibold tracking-tighter group-data-[collapsible=icon]:hidden">
              TriggerTalk
            </h1>
          </div>
        </SidebarHeader>

        <SidebarContent className="p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/dashboard'}
                tooltip="Live View"
              >
                <Link href="/dashboard">
                  <Video />
                  <span>Live View</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/history'}
                tooltip="Detection History"
              >
                <Link href="/history">
                  <History />
                  <span>Detection History</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/settings'}
                tooltip="Settings"
              >
                <Link href="/settings">
                  <Settings />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>

        <SidebarFooter className="p-2">
          <Separator className="my-2 bg-sidebar-border" />
          <div className="flex items-center gap-3 p-2 group-data-[collapsible=icon]:justify-center">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={userAvatar?.imageUrl}
                alt={userAvatar?.description}
                data-ai-hint={userAvatar?.imageHint}
              />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-sm font-medium text-sidebar-foreground">
                Admin User
              </span>
              <span className="text-xs text-muted-foreground">
                admin@triggertalk.ai
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <div className="p-1 md:hidden">
        <SidebarTrigger />
      </div>
    </>
  );
}
