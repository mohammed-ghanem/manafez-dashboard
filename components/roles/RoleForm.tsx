"use client";

import { useState } from "react";
import GroupPermission from "./GroupPermission";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  mode: "create" | "edit";
  defaultValues?: any;
  permissions: any[];
  loading?: boolean;
  onSubmit: (data: any) => void;
};

const RoleForm = ({ mode, defaultValues, permissions, loading, onSubmit }: Props) => {
  const [name, setName] = useState(defaultValues?.name || "");
  const [nameAr, setNameAr] = useState(defaultValues?.name_ar || "");
  const [nameEn, setNameEn] = useState(defaultValues?.name_en || "");

  const [selectedPermissions, setSelectedPermissions] = useState<number[]>(
    defaultValues?.permissions || []
  );

  const handleSubmit = () => {
    onSubmit({
      name,
      name_ar: nameAr,
      name_en: nameEn,
      permissions: selectedPermissions,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
        <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} placeholder="Name AR" />
        <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="Name EN" />
      </div>

      {/* Permission Groups */}
      <div className="space-y-4">
        {permissions.map((group: any) => (
          <GroupPermission
            key={group.group}
            group={group}
            selected={selectedPermissions}
            setSelected={setSelectedPermissions}
          />
        ))}
      </div>

      <Button disabled={loading} onClick={handleSubmit} className="w-full">
        {mode === "edit" ? "Update Role" : "Create Role"}
      </Button>
    </div>
  );
};

export default RoleForm;
