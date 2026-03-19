"use client";

import { useState } from "react";
import { Plus, Tag, ShoppingBag, Store } from "lucide-react";
import type { Category, Supermarket } from "@/types";

interface Props {
  categories: Category[];
  supermarkets: Supermarket[];
  onAdd: (name: string, categoryId: string, supermarketId: string) => void;
}

export default function AddGroceryItem({ onAdd, categories, supermarkets }: Props) {
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [supermarketId, setSupermarketId] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && categoryId && supermarketId) {
      onAdd(name.trim(), categoryId, supermarketId);
      setName("");
    }
  };

  return (
    <div className={`relative mb-8 overflow-hidden rounded-3xl border transition-all duration-300 ${isFocused ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10' : 'border-zinc-200 dark:border-zinc-800'}`}>
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 opacity-20 blur-sm" />
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white/50 p-6 backdrop-blur-xl dark:bg-black/50 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">
            Nombre
          </label>
          <div className="relative">
            <ShoppingBag className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Arroz"
              className="h-14 w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50 pl-12 pr-4 text-base font-medium text-zinc-900 outline-none transition-all focus:border-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100"
            />
          </div>
        </div>

        <div className="space-y-2 sm:w-48">
          <label className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">
            Categoría
          </label>
          <div className="relative">
            <Tag className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="h-14 w-full appearance-none rounded-2xl border-2 border-zinc-100 bg-zinc-50 pl-12 pr-10 text-base font-medium text-zinc-900 outline-none transition-all focus:border-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100"
            >
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2 sm:w-48">
          <label className="text-sm font-semibold tracking-wider text-zinc-400 uppercase">
            Supermercado
          </label>
          <div className="relative">
            <Store className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400 pointer-events-none" />
            <select
              value={supermarketId}
              onChange={(e) => setSupermarketId(e.target.value)}
              className="h-14 w-full appearance-none rounded-2xl border-2 border-zinc-100 bg-zinc-50 pl-12 pr-10 text-base font-medium text-zinc-900 outline-none transition-all focus:border-emerald-500/50 dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100"
            >
              <option value="">Seleccionar...</option>
              {supermarkets.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={!name || !categoryId || !supermarketId}
          className="group h-14 shrink-0 rounded-2xl bg-zinc-900 px-8 font-bold text-white transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 dark:bg-emerald-500 sm:w-auto"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-5 w-5 stroke-[3]" />
            Agregar
          </span>
        </button>
      </form>
    </div>
  );
}
