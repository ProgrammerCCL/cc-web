import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import React from "react";

interface ISelectMenusProps {
  values: any[];
  itemList: any[];
  onSelected: (v: any) => void;
  onSelectNone?: () => void;
}

export const MultipleSelectMenus = ({
  values,
  itemList,
  onSelected,
  onSelectNone,
}: ISelectMenusProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="h-full w-[120px] rounded-lg border border-slate-200 p-2 text-sm italic text-slate-700">
        {`${values.length > 0 ? `Filter : ${values.length}` : "Show All"}`}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="px-4 py-3" style={{ width: "250px" }}>
        <DropdownMenuLabel>เลือกรายการที่ต้องการ</DropdownMenuLabel>

        <Separator />

        <div className="mt-3 w-full space-y-2">
          {itemList.map((item, idx) => (
            <div key={`tx-filter-${idx}`} className="flex items-center gap-3">
              <Checkbox
                checked={values.includes(item)}
                onCheckedChange={() => onSelected(item)}
              />
              <span className="text-sm font-light">{item}</span>
            </div>
          ))}
        </div>

        <Separator className="mt-3" />

        {onSelectNone ? (
          <div className="mt-3 flex items-center gap-3">
            <Checkbox
              checked={values.length === 0}
              onCheckedChange={() => onSelectNone()}
            />
            <span className="text-sm font-light">Show All</span>
          </div>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
