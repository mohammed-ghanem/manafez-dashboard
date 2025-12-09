"use client";

import { useAppSelector } from "@/store/hooks";
import { ChevronDown, User, Settings, Key, LogOut } from "lucide-react";
import Image from "next/image";
import LogoutButton from "../auth/logout/LogoutButton";
import Link from "next/link";
import LangUseParams from "@/translate/LangUseParams";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; 

const UserDropdown = () => {
  const user = useAppSelector((state) => state.auth.user);
  const lang = LangUseParams();


  if (!user) {
    return (
      <button className="cursor-pointer">
        <User className="w-5 h-5" />
      </button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-2 cursor-pointer focus:outline-none">
          <Image
            src={user.image || "/default-avatar.png"}
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <span className="text-sm">hi {user.name}</span>
          <ChevronDown className="w-4 h-4 text-white" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/profile`} className="cursor-pointer flex items-center">
            <Settings className="w-4 h-4 mr-2" />
            Profile
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuItem asChild>
          <Link href={`/${lang}/change-password`} className="cursor-pointer flex items-center">
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        {/* Fixed LogoutButton usage */}
        <DropdownMenuItem className="p-0 focus:bg-accent focus:text-accent-foreground">
          <div className="flex items-center w-full px-2 py-1.5 text-sm">
            <LogOut className="w-4 h-4 mr-2" />
            <LogoutButton>Logout</LogoutButton>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserDropdown;