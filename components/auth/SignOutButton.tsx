"use client";

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <Button
            variant="ghost"
            className="w-full justify-start h-12 text-base font-normal text-red-600 hover:bg-red-50 hover:text-red-700 hover:bg-red-900/10 dark:hover:text-red-400"
            onClick={() => signOut({ callbackUrl: '/' })}
        >
            <LogOut className="w-5 h-5 ml-3" />
            تسجيل الخروج
        </Button>
    );
}
