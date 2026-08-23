"use client";

import React from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/auth/actions";
import {
  LogOut,
  LayoutDashboard,
  BookOpen,
  Trophy,
} from "lucide-react";

interface UserNavProps {
  user: {
    id: string;
    email?: string;
    displayName?: string;
    avatarUrl?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  const name =
    user.displayName || (user.email ? user.email.split("@")[0] : "Learner");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-9 w-9 rounded-full border border-zinc-700 bg-zinc-900 p-0 hover:bg-zinc-800 focus-visible:ring-2 focus-visible:ring-emerald-500"
          aria-label="Open user menu"
        >
          {user.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={name}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
              {name.charAt(0).toUpperCase()}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-semibold leading-none text-foreground">
              {name}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link
            href="/dashboard"
            className="flex w-full items-center gap-2 text-xs cursor-pointer"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-emerald-400" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/courses"
            className="flex w-full items-center gap-2 text-xs cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-blue-400" />
            <span>All Courses</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link
            href="/progress"
            className="flex w-full items-center gap-2 text-xs cursor-pointer"
          >
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span>My Progress & Proofs</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <form action={signOut} className="w-full">
            <button
              type="submit"
              className="flex w-full items-center gap-2 text-xs text-red-400 hover:text-red-300 focus:text-red-300 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
