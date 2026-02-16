import React from "react";
import Link from "next/link";
import Image from "next/image";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { INavbarItem } from "@/types/share";

interface ISidebarItemProps {
  item: INavbarItem;
  small?: boolean;
  active?: boolean;
  allow?: boolean;
  danger?: boolean;
}

export const SidebarItem = ({
  item,
  allow,
  active,
  small,
  danger,
}: ISidebarItemProps) => {
  return small ? (
    <Tooltip key={item.route}>
      <TooltipTrigger asChild>
        <Link
          href={allow ? item.route : "#"}
          className={cn(
            "flex size-9 bg-slate-800 items-center justify-center rounded-lg text-muted-foreground transition-colors md:size-8",
            allow
              ? `hover:text-foreground ${danger ? "hover:bg-red-800" : "hover:bg-customButon"}`
              : "cursor-not-allowed bg-slate-300",
            active ? `${danger ? "bg-red-800" : "bg-customButon"}` : ""
          )}
        >
          <Image src={item.imgURL} alt={item.en} width={20} height={20} />
          <span className="sr-only">{item.th}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{item.th}</TooltipContent>
    </Tooltip>
  ) : (
    <Link
      key={item.route}
      href={allow ? item.route : "#"}
      className={cn(
        "p-2 rounded-lg text-muted-foreground transition-colors hover:text-xl text-black text-lg ",
        allow
          ? `hover:text-white hover:font-bold ${danger ? "hover:bg-red-800" : "hover:bg-customButon"}`
          : "cursor-not-allowed text-slate-300",
        active
          ? `text-foreground text-lg ${danger ? "bg-red-800" : "bg-customButon"}`
          : ""
      )}
    >
      {item.th}
    </Link>
  );
};
