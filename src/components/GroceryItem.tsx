"use client";

import { Trash2, Tag, Store } from "lucide-react";
import type { GroceryItem } from "@/types";

interface Props {
  item: GroceryItem;
  onDelete: (id: string) => void;
}

export default function GroceryItemRow({ item, onDelete }: Props) {
  return (
    <div className="group relative flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition-all hover:border-emerald-200 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-base font-bold text-zinc-900 dark:text-zinc-100 italic group-hover:not-italic transition-all">
            {item.name}
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-bold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400">
              <Tag className="h-3 w-3" />
              {item.categories?.name || "No Category"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400">
              <Store className="h-3 w-3" />
              {item.supermarkets?.name || "No Supermarket"}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onDelete(item.id)}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-400 hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-950/30 transition-all sm:opacity-0 group-hover:opacity-100"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  );
}
