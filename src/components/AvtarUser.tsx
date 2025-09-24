"use client";

import React from "react";
import { Button } from "./ui/button";
import { LogOut, Settings, ChevronsUpDown, UserStar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import OneTimePopUp from "./OneTimePopUp";

const AvtarUser = ({
  userEmail,
  openSettings,
  handleLogout,
  primeMember
}: {
  userEmail: string | null;
  openSettings: () => void;
  handleLogout: () => void;
    primeMember: boolean;
}) => {
  if (!userEmail) return null;

  // Extract initials from email
  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-10 px-2 gap-2">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src="" alt={userEmail} />
              <AvatarFallback className={`rounded-lg ${primeMember ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 text-amber-900 border-2 border-amber-400 shadow-lg' : 'bg-blue-100 text-blue-600'}`}>
                {getInitials(userEmail)}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:grid flex-1 text-left text-sm leading-tight">
              <span className="truncate text-xs text-gray-600 dark:text-gray-300">
                {userEmail}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 hidden md:block" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 rounded-lg"
          align="end"
          sideOffset={4}
        >
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="" alt={userEmail} />
                <AvatarFallback className={`rounded-lg ${primeMember ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 text-amber-900 border-2 border-amber-400 shadow-lg ' : 'bg-blue-100 text-blue-600'}`}>
                  {getInitials(userEmail)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">User</span>
                <span className={`truncate text-xs ${primeMember ? 'text-amber-600 font-medium' : 'text-gray-600'}`}>
                  {userEmail}
                </span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={openSettings}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <UserStar className="mr-2 h-4 w-4" />
            <OneTimePopUp hideButton={false} primeMember={primeMember}>Prime Member</OneTimePopUp>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default AvtarUser;
