"use client";

import { useState } from "react";
import PermissionCheckbox from "./PermissionCheckbox";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GroupPermission = ({ group, selected, setSelected }: any) => {
  const [open, setOpen] = useState(true);

  const toggleAllGroup = () => {
    const groupIds = group.items.map((p: any) => p.id);
    const allSelected = groupIds.every((id: number) => selected.includes(id));

    if (allSelected) {
      setSelected(selected.filter((id: number) => !groupIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selected, ...groupIds]));
      setSelected(merged);
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => setOpen(!open)}>
            {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
          <h2 className="font-semibold">{group.group}</h2>
        </div>

        <Button size="sm" variant="outline" onClick={toggleAllGroup}>
          Select All
        </Button>
      </div>

      {open && (
        <div className="space-y-2">
          {group.items.map((p: any) => (
            <PermissionCheckbox
              key={p.id}
              permission={p}
              selected={selected}
              setSelected={setSelected}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupPermission;
