"use client";

import { PermissionGroup } from "@/types/roles";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

type Props = {
  permissions: PermissionGroup[];
};

export default function PermissionsAccordion({ permissions }: Props) {
  return (
    <Accordion type="multiple" className="w-full">
      {permissions.map((group, i) => (
        <AccordionItem key={i} value={`group-${i}`}>
          <AccordionTrigger className="text-right">
            {group.name}
          </AccordionTrigger>

          <AccordionContent>
            <div className="flex flex-wrap gap-2">
              {group.controls.map((c) => (
                <Badge key={c.id} variant="secondary" className="px-3 py-1">
                  {c.name}
                </Badge>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
