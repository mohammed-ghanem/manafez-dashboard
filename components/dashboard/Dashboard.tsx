"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { Column, DataTable } from "../datatable/DataTable";

type Admin = {
  name: string;
  email: string;
  rolesName: string;
  status: boolean;
};

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([
    {
      name: "mariam",
      email: "mariam@gmail.com",
      rolesName: "مشرف",
      status: true,
    },
    {
      name: "habiba",
      email: "habiba@gmail.com",
      rolesName: "كاتب",
      status: false,
    },
  ]);

  const columns: Column<Admin>[] = [
    {
      key: "name",
      header: "Name",
    },
    {
      key: "email",
      header: "Email",
    },
    {
      key: "rolesName",
      header: "Rolessss",
    },
    {
      key: "status",
      header: "Status",
      align: "center",
    },
    {
      key: "email",
      header: "Actions",
      align: "center",
      render: () => (
        <div className="flex justify-center gap-2">
          <Button size="icon" variant="destructive">
            <Trash className="h-4 w-4" />
          </Button>
          <Button size="icon">
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
        <div className="h-100 w-full bg-red-950">
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        </div>
    <DataTable
      data={admins}
      columns={columns}
      searchPlaceholder="Search admins..."
      onToggleStatus={(row) =>
        setAdmins((prev) =>
          prev.map((a) =>
            a.email === row.email ? { ...a, status: !a.status } : a
          )
        )
      }
    />
    </div>
  );
}
