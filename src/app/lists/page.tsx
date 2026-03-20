"use client";

import { useState, useEffect } from "react";
import { Trash2, ListTodo, Plus, ChevronRight, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ShoppingList } from "@/types";
import Link from "next/link";

export default function ListsPage() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    setIsLoading(true);
    const { data } = await supabase.from("shopping_lists").select("*").order("created_at", { ascending: false });
    if (data) setLists(data);
    setIsLoading(false);
  };

  const handleAddList = async (name: string) => {
    const { data, error } = await supabase.from("shopping_lists").insert([{ name }]).select().single();
    if (data) {
      setLists([data, ...lists]);
      setIsCreating(false);
    }
    if (error) console.error("Error adding list:", error);
  };

  const handleDeleteList = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta lista?")) return;
    
    const { error } = await supabase.from("shopping_lists").delete().eq("id", id);
    if (!error) setLists(lists.filter(l => l.id !== id));
  };

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500 pt-10 pb-10">
      <div className="flex-shrink-0 space-y-8 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/10 dark:bg-emerald-500 dark:shadow-emerald-500/10">
              <ListTodo className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                Mis Listas
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium">Organiza tus compras por ocasión o receta.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 h-12 px-6 rounded-2xl bg-zinc-900 font-bold text-white dark:bg-emerald-500 hover:opacity-90 shadow-xl shadow-zinc-900/10 dark:shadow-emerald-500/10 transition-all active:scale-95"
          >
            Crear
          </button>
        </div>

        {/* Create List Form */}
        {isCreating && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-950 animate-in zoom-in-95 duration-300">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4 px-2">Nombre de la Lista</h3>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem("name") as HTMLInputElement;
                if (!input.value.trim()) return;
                handleAddList(input.value);
                input.value = "";
              }}
              className="flex gap-3"
            >
              <div className="relative flex-1">
                <input 
                  name="name"
                  placeholder="Ej: Hot Dogs, Cena de Navidad..."
                  autoFocus
                  className="w-full h-14 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 text-zinc-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 transition-all font-medium"
                />
              </div>
              <button type="submit" className="h-14 px-8 rounded-2xl bg-zinc-900 font-bold text-white dark:bg-emerald-500 hover:opacity-90 transition-all active:scale-95">
                Crear
              </button>
            </form>
          </div>
        )}
      </div>

      {/* List Gallery */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : lists.length === 0 ? (
          <div className="border border-dashed border-zinc-200 dark:border-zinc-800 rounded-[40px] py-20 text-center bg-zinc-50/30 dark:bg-zinc-900/20">
            <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-100 text-zinc-400 dark:bg-zinc-900/50">
              <ListTodo className="h-10 w-10 opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">No tienes listas aún</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto mt-2">Crea tu primera lista para empezar a organizar tus compras.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lists.map(list => (
              <div 
                key={list.id} 
                className="group relative flex flex-col rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm hover:shadow-xl hover:shadow-zinc-200/50 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:shadow-none transition-all hover:-translate-y-1"
              >
                <Link href={`/lists/${list.id}`} className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-500">
                      <ListTodo className="h-6 w-6" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-zinc-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                  
                  <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-50 mb-1 truncate">
                    {list.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    <Calendar className="h-3 w-3" />
                    {new Date(list.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </div>
                </Link>

                <button 
                   onClick={(e) => {
                    e.preventDefault();
                    handleDeleteList(list.id);
                  }}
                  className="absolute bottom-6 right-6 p-2 text-rose-500 bg-rose-50 dark:bg-rose-500/10 sm:text-zinc-400 sm:bg-transparent sm:dark:bg-transparent sm:opacity-0 sm:group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all rounded-xl active:scale-95"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
