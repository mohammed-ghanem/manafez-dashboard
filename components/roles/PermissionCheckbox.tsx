"use client";

import { Checkbox } from "@/components/ui/checkbox";

const PermissionCheckbox = ({ permission, selected, setSelected }: any) => {
  const checked = selected.includes(permission.id);

  const toggle = () => {
    if (checked) {
      setSelected(selected.filter((id: number) => id !== permission.id));
    } else {
      setSelected([...selected, permission.id]);
    }
  };

  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <Checkbox checked={checked} onCheckedChange={toggle} />
      <span className="text-sm">{permission.name}</span>
    </label>
  );
};

export default PermissionCheckbox;
