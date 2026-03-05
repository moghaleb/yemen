'use client';

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteUser } from "@/app/actions/user";

interface DeleteUserButtonProps {
    userId: string;
}

export function DeleteUserButton({ userId }: DeleteUserButtonProps) {
    const handleDelete = async () => {
        if (confirm("هل أنت متأكد من رغبتك في حذف هذا المستخدم نهائياً؟")) {
            try {
                const formData = new FormData();
                formData.append("userId", userId);
                await deleteUser(formData);
            } catch (error: any) {
                alert(error.message || "حدث خطأ أثناء الحذف");
            }
        }
    };

    return (
        <Button
            size="sm"
            variant="destructive"
            type="button"
            onClick={handleDelete}
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    );
}
