"use client";

import { useState, useEffect } from "react";
import { Trash2, Tag, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Category } from "@/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    const { data } = await supabase.from("categories").select("*").order("name");
    if (data) setCategories(data);
    setIsLoading(false);
  };

  const handleAddCategory = async (name: string) => {
    const { data, error } = await supabase.from("categories").insert([{ name }]).select().single();
    if (data) setCategories([...categories, data].sort((a, b) => a.name.localeCompare(b.name)));
    if (error) console.error("Error adding category:", error);
  };

  const handleDeleteCategory = async (id: string) => {
    // Check if there are products associated with this category
    const { count, error: countError } = await supabase
      .from("products")
      .select("*", { count: 'exact', head: true })
      .eq("category_id", id);

    if (countError) {
      console.error("Error checking usage:", countError);
      return;
    }

    if (count && count > 0) {
      alert(`No se puede borrar esta categoría porque tiene ${count} ${count === 1 ? 'producto asociado' : 'productos asociados'}. Borra primero los productos.`);
      return;
    }

    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) setCategories(categories.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 pt-10 pb-10">
      <div className="flex-shrink-0 space-y-8 mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/10">
              <Tag className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900">
                Categorías
              </h1>
              <p className="text-zinc-500 font-medium">Clasifica tus productos para encontrarlos rápido.</p>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl">
          <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4 px-2">Agregar Nueva Categoría</h3>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const input = form.elements.namedItem("name") as HTMLInputElement;
              if (!input.value.trim()) return;
              handleAddCategory(input.value);
              input.value = "";
            }}
            className="flex gap-3"
          >
            <div className="relative flex-1">
              <input 
                name="name"
                placeholder="Nombre"
                className="w-full h-14 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-zinc-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-medium"
              />
            </div>
            <button className="h-14 px-8 rounded-2xl bg-zinc-900 font-bold text-white hover:opacity-90 shadow-xl shadow-zinc-900/10 transition-all active:scale-95">
              Agregar
            </button>
          </form>
        </div>
      </div>

      {/* List Section - Now Scrollable */}
      <div className="flex-1 min-h-0 flex flex-col rounded-3xl border border-zinc-200 bg-white shadow-xl overflow-hidden">
        <div className="flex-shrink-0 p-6 pb-4 border-b border-zinc-50">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400">Categorías Registradas</h3>
            <span className="text-[10px] font-bold bg-zinc-100 px-2 py-1 rounded-md text-zinc-500">
              {categories.length} total
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pt-2 custom-scrollbar">
          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {categories.map(c => (
                <div 
                  key={c.id} 
                  className="group flex items-center justify-between rounded-2xl border border-zinc-50 bg-zinc-50/50 p-4 hover:border-emerald-500/30 hover:bg-white transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 group-hover:text-emerald-500 transition-colors">
                      <Tag className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-zinc-700">{c.name}</span>
                  </div>
                  <button 
                    onClick={() => handleDeleteCategory(c.id)}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-500 bg-rose-50 rounded-xl opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:bg-rose-500 hover:text-white transition-all transform active:scale-90"
                  >
                    <Trash2 className="h-4 w-4"/>
                  </button>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="border border-dashed border-zinc-200 rounded-3xl py-12 text-center bg-zinc-50/30">
                  <p className="text-zinc-500 font-medium">No hay categorías registradas todavía.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
