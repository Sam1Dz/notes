'use client';

import { useTheme } from 'next-themes';
import * as React from 'react';
import { LuLogOut, LuMonitor, LuMoon, LuSun, LuSunMoon } from 'react-icons/lu';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '~/shared/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/shared/components/ui/dropdown-menu';
import { Separator } from '~/shared/components/ui/separator';
import { Button } from '~/shared/components/ui/shadcn-studio/button';
import { ButtonGroup } from '~/shared/components/ui/shadcn-studio/button-group';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '~/shared/components/ui/sheet';
import { useIsMobile } from '~/shared/hooks/use-mobile';

export function HeaderUser() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileView />;
  }

  return <DesktopView />;
}

function UserAvatar({ ...props }) {
  return (
    <Avatar className="cursor-pointer" {...props}>
      <AvatarImage src="https://avatars.githubusercontent.com/u/36542547?v=4" />
      <AvatarFallback>S</AvatarFallback>
    </Avatar>
  );
}

function UserInfo() {
  return (
    <div className="flex items-center gap-2">
      <UserAvatar />
      <div className="flex flex-1 flex-col">
        <span className="text-popover-foreground">Pratama Dimas</span>
        <span className="text-muted-foreground text-xs">
          pratamadimas.pw@gmail.com
        </span>
      </div>
    </div>
  );
}

function DesktopView() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <UserAvatar />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        <DropdownMenuLabel className="flex items-center gap-2">
          <UserInfo />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="h-9 cursor-pointer gap-2">
              <LuSunMoon size={16} />
              Color Scheme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuCheckboxItem
                  checked={theme === 'light'}
                  className="h-9 cursor-pointer"
                  onCheckedChange={() => setTheme('light')}
                >
                  Light
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={theme === 'dark'}
                  className="h-9 cursor-pointer"
                  onCheckedChange={() => setTheme('dark')}
                >
                  Dark
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={theme === 'system'}
                  className="h-9 cursor-pointer"
                  onCheckedChange={() => setTheme('system')}
                >
                  System
                </DropdownMenuCheckboxItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem
            className="text-error focus:bg-error dark:focus:bg-error-foreground focus:text-error-foreground dark:focus:text-error h-9 cursor-pointer"
            variant="default"
          >
            <LuLogOut className="dark:text-error focus:text-error-foreground" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MobileView() {
  const { setTheme, theme } = useTheme();
  const [sheetOpen, setSheetOpen] = React.useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <UserAvatar />
      </SheetTrigger>
      <SheetContent
        className="justify-between gap-4"
        closableButton={false}
        side="right"
      >
        <SheetTitle className="sr-only">User Menu</SheetTitle>

        <div>
          <div className="p-3 pb-0">
            <UserInfo />
          </div>
          <Separator className="mt-3" />
        </div>

        <div>
          <Separator className="mb-4" />
          <div className="flex flex-col gap-2 p-3 pt-0">
            <ButtonGroup className="w-full">
              <Button
                variant={theme === 'light' ? 'default' : 'outline'}
                onClick={() => setTheme('light')}
              >
                <LuSun />
                Light
              </Button>
              <Button
                variant={theme === 'system' ? 'default' : 'outline'}
                onClick={() => setTheme('system')}
              >
                <LuMonitor />
                System
              </Button>
              <Button
                variant={theme === 'dark' ? 'default' : 'outline'}
                onClick={() => setTheme('dark')}
              >
                <LuMoon />
                Dark
              </Button>
            </ButtonGroup>
            <Button className="dark:bg-error-foreground bg-error text-error-foreground dark:text-error w-full">
              <LuLogOut />
              Logout
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
