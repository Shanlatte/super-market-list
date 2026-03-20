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
    <div className={`relative mb-8 overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${isFocused ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10' : 'border-zinc-200 dark:border-zinc-800'}`}>
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 opacity-20 blur-md" />
      
      <form onSubmit={handleSubmit} className="bg-white p-8 dark:bg-zinc-950">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-end">
          {/* Nombre */}
          <div className="md:col-span-2 lg:col-span-5 space-y-2.5">
            <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase px-1">
              Nombre del Producto
            </label>
            <div className="relative group">
              <ShoppingBag className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-emerald-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Nombre"
                className="h-16 w-full rounded-2xl border-2 border-zinc-100 bg-zinc-50 pl-12 pr-4 text-base font-bold text-zinc-900 outline-none transition-all focus:border-emerald-500/50 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:bg-zinc-900"
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="lg:col-span-3 space-y-2.5">
            <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase px-1">
              Categoría
            </label>
            <div className="relative group">
              <Tag className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400 pointer-events-none transition-colors group-focus-within:text-emerald-500" />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="h-16 w-full appearance-none rounded-2xl border-2 border-zinc-100 bg-zinc-50 pl-12 pr-10 text-base font-bold text-zinc-900 outline-none transition-all focus:border-emerald-500/50 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 cursor-pointer"
              >
                <option value="" disabled>Seleccionar...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Supermercado */}
          <div className="lg:col-span-3 space-y-2.5">
            <label className="text-[10px] font-black tracking-[0.2em] text-zinc-400 uppercase px-1">
              Supermercado
            </label>
            <div className="relative group">
              <Store className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400 pointer-events-none transition-colors group-focus-within:text-emerald-500" />
              <select
                value={supermarketId}
                onChange={(e) => setSupermarketId(e.target.value)}
                className="h-16 w-full appearance-none rounded-2xl border-2 border-zinc-100 bg-zinc-50 pl-12 pr-10 text-base font-bold text-zinc-900 outline-none transition-all focus:border-emerald-500/50 focus:bg-white dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-100 cursor-pointer"
              >
                <option value="" disabled>Seleccionar...</option>
                {supermarkets.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón */}
          <div className="lg:col-span-1">
            <button
              type="submit"
              disabled={!name || !categoryId || !supermarketId}
              className="h-16 w-full rounded-2xl bg-zinc-900 font-black text-xs uppercase tracking-widest text-white transition-all transform hover:scale-[1.05] active:scale-95 disabled:opacity-30 disabled:grayscale dark:bg-emerald-500 shadow-xl shadow-zinc-900/10 dark:shadow-emerald-500/20"
            >
              <Plus className="h-6 w-6 mx-auto stroke-[4]" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
