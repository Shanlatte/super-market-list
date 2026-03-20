"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, Filter, ShoppingCart, Tag, Store, X } from "lucide-react";
import GroceryItemRow from "@/components/GroceryItem";
import { supabase } from "@/lib/supabase";
import type { GroceryItem, Category, Supermarket } from "@/types";

export default function Home() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSupermarkets, setSelectedSupermarkets] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        { data: productsData },
        { data: catsData },
        { data: supersData }
      ] = await Promise.all([
        supabase.from("products").select("*, categories(name), supermarkets(name)"),
        supabase.from("categories").select("*").order("name"),
        supabase.from("supermarkets").select("*").order("name")
      ]);

      if (productsData) setItems(productsData);
      if (catsData) setCategories(catsData);
      if (supersData) setSupermarkets(supersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setItems(items.filter(item => item.id !== id));
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories(prev => 
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleSupermarket = (id: string) => {
    setSelectedSupermarkets(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category_id);
        const matchesSupermarket = selectedSupermarkets.length === 0 || selectedSupermarkets.includes(item.supermarket_id);
        return matchesSearch && matchesCategory && matchesSupermarket;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, searchQuery, selectedCategories, selectedSupermarkets]);

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-700">
      <div className="flex-shrink-0 pt-10 pb-6">
        {/* <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 mb-2">
            Buscar Productos
          </h1>
        </div> */}

        <div className="flex flex-col gap-6">
          {/* Search and Dropdowns Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute top-1/2 left-5 h-6 w-6 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-emerald-500" />
              <input 
                type="text"
                placeholder="¿Qué estás buscando hoy?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 w-full rounded-2xl border border-zinc-200 bg-white pl-14 pr-6 text-lg font-bold text-zinc-900 shadow-sm outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 placeholder:text-zinc-400"
              />
            </div>

            <div className="flex gap-2 shrink-0">
              <div className="relative group flex-1 md:flex-none">
                <Tag className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400 pointer-events-none group-focus-within:text-emerald-500" />
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      toggleCategory(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="h-16 w-full md:w-48 rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-sm font-bold text-zinc-700 outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Categoría...</option>
                  {categories
                    .filter(cat => !selectedCategories.includes(cat.id))
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  }
                </select>
              </div>

              <div className="relative group flex-1 md:flex-none">
                <Store className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400 pointer-events-none group-focus-within:text-emerald-500" />
                <select 
                  onChange={(e) => {
                    if (e.target.value) {
                      toggleSupermarket(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="h-16 w-full md:w-48 rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-sm font-bold text-zinc-700 outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 appearance-none cursor-pointer"
                  defaultValue=""
                >
                  <option value="" disabled>Súper...</option>
                  {supermarkets
                    .filter(s => !selectedSupermarkets.includes(s.id))
                    .map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))
                  }
                </select>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          {(selectedCategories.length > 0 || selectedSupermarkets.length > 0) && (
            <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              {selectedCategories.map(id => {
                const name = categories.find(c => c.id === id)?.name;
                return (
                  <button
                    key={id}
                    onClick={() => toggleCategory(id)}
                    className="flex items-center gap-2 rounded-xl bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-600 active:scale-95"
                  >
                    <Tag className="h-3 w-3" />
                    {name}
                    <X className="h-3 w-3" />
                  </button>
                );
              })}
              {selectedSupermarkets.map(id => {
                const name = supermarkets.find(s => s.id === id)?.name;
                return (
                  <button
                    key={id}
                    onClick={() => toggleSupermarket(id)}
                    className="flex items-center gap-2 rounded-xl bg-zinc-900 px-3 py-1.5 text-xs font-bold text-white shadow-lg shadow-zinc-900/10 transition-all hover:bg-black active:scale-95"
                  >
                    <Store className="h-3 w-3" />
                    {name}
                    <X className="h-3 w-3" />
                  </button>
                );
              })}
              <button 
                onClick={() => {
                  setSelectedCategories([]);
                  setSelectedSupermarkets([]);
                }}
                className="px-3 py-1.5 text-xs font-bold text-zinc-400 hover:text-rose-500 transition-colors"
              >
                Limpiar todo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Results - This part scrolls */}
      <div className="flex-1 overflow-y-auto pr-2 pb-10 custom-scrollbar">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">
            {filteredItems.length} Productos Encontrados
          </h2>
          <div className="h-px flex-1 mx-6 bg-zinc-200" />
        </div>

        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="rounded-[40px] border-2 border-dashed border-zinc-200 py-20 text-center animate-in fade-in zoom-in-95 duration-700">
            <div className="mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-zinc-50 text-zinc-400">
              <ShoppingCart className="h-10 w-10 opacity-20" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900">No hay resultados</h3>
            <p className="text-zinc-500 max-w-xs mx-auto mt-2">Intenta ajustar tus filtros o buscar algo diferente.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map(item => (
              <div key={item.id} className="animate-reveal-bottom">
                <div className="rounded-3xl border border-zinc-100 bg-white p-2 transition-all hover:shadow-xl hover:shadow-zinc-200/50 hover:-translate-y-1">
                  <GroceryItemRow 
                    item={item} 
                    onDelete={handleDeleteProduct} 
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
