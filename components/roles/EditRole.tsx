"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ActFetchPermissions } from "@/store/permissions/thunkActions";
import { ActFetchRoleById } from "@/store/roles/thunkActions/ActFetchRoleById";
import { ActUpdateRole } from "@/store/roles/thunkActions/ActUpdateRole";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Shield, CheckSquare } from "lucide-react";
import { toast } from "sonner";

const EditRole = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const params = useParams();
  const roleId = Number(params.id);

  const { record: permissionsRecord, loading: permLoading } = useAppSelector(
    (state) => state.permissions
  );
  const { selectedRole: roleData, loading: roleLoading } = useAppSelector(
    (state) => state.roles
  );

  // Form state
  const [name, setName] = useState("");
  const [name_en, setNameEn] = useState("");
  const [name_ar, setNameAr] = useState("");

  // Permission IDs
  const [selected, setSelected] = useState<number[]>([]);

  // Fetch role + permissions
  useEffect(() => {
    dispatch(ActFetchPermissions());
    dispatch(ActFetchRoleById(roleId));
  }, [dispatch, roleId]);

  // Fill form after loading
  useEffect(() => {
    if (!roleData) return;

    setName(roleData.name || "");
    setNameEn(roleData.name_en || "");
    setNameAr(roleData.name_ar || "");

    if (roleData.permissions) {
      const ids = roleData.permissions.flatMap((group: any) =>
        group.controls.map((c: any) => c.id)
      );

      setSelected(ids);
    }
  }, [roleData]);

  // Toggle single control
  const toggleControl = (id: number) => {
    setSelected((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  // Select all permissions
  const selectAllPermissions = () => {
    const all = permissionsRecord.flatMap((group: any) =>
      group.controls.map((c: any) => c.id)
    );
    setSelected(all);
  };

  // Select whole group
  const selectGroup = (controls: any[]) => {
    const ids = controls.map((c) => c.id);
    setSelected((prev) => [...new Set([...prev, ...ids])]);
  };

  // Update role
  const handleUpdate = async () => {
    if (!name || !name_en || !name_ar) {
      toast.error("All name fields are required");
      return;
    }

    if (selected.length === 0) {
      toast.error("Select at least one permission");
      return;
    }

    try {
      await dispatch(
        ActUpdateRole({
          id: roleId,
          body: {
            name,
            name_en,
            name_ar,
            permissions: selected,
          },
        })
      ).unwrap();

      toast.success("Role updated successfully");
      router.push("/roles");
    } catch (err: any) {
      if (err?.errors) {
        Object.values(err.errors).forEach((e: any) => toast.error(String(e)));
      } else {
        toast.error(err?.message || "Update failed");
      }
    }
  };

  if (roleLoading || permLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Shield className="w-6 h-6 text-primary" />
        Edit Role
      </h1>

      {/* Form */}
      <Card className="p-4 space-y-4">
        <div>
          <Label>Role Name</Label>
          <Input
            className="mt-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <Label>Role Name (English)</Label>
          <Input
            className="mt-1"
            value={name_en}
            onChange={(e) => setNameEn(e.target.value)}
          />
        </div>

        <div>
          <Label>Role Name (Arabic)</Label>
          <Input
            className="mt-1"
            value={name_ar}
            onChange={(e) => setNameAr(e.target.value)}
          />
        </div>
      </Card>

      {/* Permissions */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Permissions</h2>

        <Button variant="outline" onClick={selectAllPermissions}>
          <CheckSquare className="w-4 h-4 mr-2" />
          Select All
        </Button>
      </div>

      <ScrollArea className="h-[60vh] pr-3">
        <div className="grid grid-cols-3 gap-6">
          {permissionsRecord.map((group: any) => (
            <Card key={group.name} className="border rounded-xl shadow-sm">
              <CardHeader className="flex justify-between items-center">
                <CardTitle className="capitalize">{group.name}</CardTitle>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => selectGroup(group.controls)}
                >
                  Select Group
                </Button>
              </CardHeader>

              <CardContent>
                <div className="space-y-3">
                  {group.controls.map((control: any) => (
                    <div
                      key={control.id}
                      className="flex items-center gap-3 border rounded-lg p-3"
                    >
                      <Checkbox
                        checked={selected.includes(control.id)}
                        onCheckedChange={() => toggleControl(control.id)}
                      />

                      <span className="text-sm font-medium">
                        {control.name}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Button className="w-full" onClick={handleUpdate}>
        Update Role
      </Button>
    </div>
  );
};

export default EditRole;