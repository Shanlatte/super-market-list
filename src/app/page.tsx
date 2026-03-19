"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, ShoppingCart, Filter, Trash2, Plus, X, Tag, Store, Menu } from "lucide-react";
import GroceryItemRow from "@/components/GroceryItem";
import AddGroceryItem from "@/components/AddGroceryItem";
import { supabase } from "@/lib/supabase";
import type { GroceryItem, Category, Supermarket } from "@/types";

export default function Home() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [filterSupermarket, setFilterSupermarket] = useState<string>("All");
  
  const [isLoading, setIsLoading] = useState(true);
  const [showManager, setShowManager] = useState<"Categories" | "Supermarkets" | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Fetch initial data
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

  const handleAddProduct = async (name: string, categoryId: string, supermarketId: string) => {
    const { data, error } = await supabase
      .from("products")
      .insert([{ name, category_id: categoryId, supermarket_id: supermarketId }])
      .select("*, categories(name), supermarkets(name)")
      .single();

    if (data) {
      setItems([data, ...items]);
      setIsAddingProduct(false); // Close form after adding
    }
    if (error) console.error("Error adding product:", error);
  };

  const handleDeleteProduct = async (id: string) => {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (!error) setItems(items.filter(item => item.id !== id));
  };

  const handleAddCategory = async (name: string) => {
    const { data, error } = await supabase.from("categories").insert([{ name }]).select().single();
    if (data) setCategories([...categories, data].sort((a, b) => a.name.localeCompare(b.name)));
    if (error) console.error("Error adding category:", error);
  };

  const handleDeleteCategory = async (id: string) => {
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (!error) setCategories(categories.filter(c => c.id !== id));
  };

  const handleAddSupermarket = async (name: string) => {
    const { data, error } = await supabase.from("supermarkets").insert([{ name }]).select().single();
    if (data) setSupermarkets([...supermarkets, data].sort((a, b) => a.name.localeCompare(b.name)));
    if (error) console.error("Error adding supermarket:", error);
  };

  const handleDeleteSupermarket = async (id: string) => {
    const { error } = await supabase.from("supermarkets").delete().eq("id", id);
    if (!error) setSupermarkets(supermarkets.filter(s => s.id !== id));
  };

  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === "All" || item.category_id === filterCategory;
        const matchesSupermarket = filterSupermarket === "All" || item.supermarket_id === filterSupermarket;
        return matchesSearch && matchesCategory && matchesSupermarket;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [items, searchQuery, filterCategory, filterSupermarket]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-[#050505]">
      {/* Header */}
      <header className="sticky top-0 z-50 animate-reveal-top border-b border-zinc-200/60 bg-white/70 backdrop-blur-2xl dark:border-zinc-800/60 dark:bg-black/70">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/10 dark:bg-emerald-500 dark:shadow-emerald-500/10">
              <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none">
                Lista Supermercado
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setIsAddingProduct(!isAddingProduct);
                setShowManager(null);
                setIsMenuOpen(false);
              }}
              className={`group relative h-10 sm:h-11 px-3 sm:px-6 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 overflow-hidden ${isAddingProduct ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "bg-zinc-900 text-white shadow-lg shadow-zinc-900/20 dark:bg-emerald-500 dark:shadow-emerald-500/10"}`}
            >
              <Plus className={`h-4 w-4 transition-transform duration-500 ${isAddingProduct ? 'rotate-45' : 'group-hover:rotate-90'}`} />
              <span className="hidden sm:inline">{isAddingProduct ? "Cancelar" : "Agregar Producto"}</span>
              <span className="sm:hidden">{isAddingProduct ? "Cancelar" : "Agregar"}</span>
            </button>

            <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden md:block" />

            {/* Desktop Admin Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => {
                  setShowManager(showManager === "Categories" ? null : "Categories");
                  setIsAddingProduct(false);
                }}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${showManager === "Categories" ? "bg-zinc-900 text-white dark:bg-emerald-500" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-200"}`}
              >
                Categorias
              </button>
              <button 
                onClick={() => {
                  setShowManager(showManager === "Supermarkets" ? null : "Supermarkets");
                  setIsAddingProduct(false);
                }}
                className={`rounded-xl px-4 py-2 text-sm font-bold transition-all ${showManager === "Supermarkets" ? "bg-zinc-900 text-white dark:bg-emerald-500" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-900 dark:text-zinc-400 hover:bg-zinc-200"}`}
              >
                Supermercados
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="relative md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${isMenuOpen ? "bg-zinc-900 text-white dark:bg-emerald-500" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400"}`}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl border border-zinc-200 bg-white p-2 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                  <button 
                    onClick={() => {
                      setShowManager("Categories");
                      setIsMenuOpen(false);
                      setIsAddingProduct(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <Tag className="h-4 w-4" />
                    Categorias
                  </button>
                  <button 
                    onClick={() => {
                      setShowManager("Supermarkets");
                      setIsMenuOpen(false);
                      setIsAddingProduct(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <Store className="h-4 w-4" />
                    Supermercados
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
        {/* Management Panels */}
        {showManager && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500 rounded-3xl border border-zinc-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">Administrar {showManager}</h3>
              <button onClick={() => setShowManager(null)} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 hover:text-zinc-900 transition-colors">
                <X className="h-5 w-5"/>
              </button>
            </div>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const input = form.elements.namedItem("name") as HTMLInputElement;
                if (!input.value.trim()) return;
                if (showManager === "Categories") handleAddCategory(input.value);
                else handleAddSupermarket(input.value);
                input.value = "";
              }}
              className="mb-6 flex gap-2"
            >
              <input 
                name="name"
                placeholder="Nombre"
                className="flex-1 h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-zinc-900 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <button className="h-12 rounded-xl bg-zinc-900 px-6 font-bold text-white dark:bg-emerald-500 hover:opacity-90 shadow-lg shadow-zinc-900/10 dark:shadow-emerald-500/10">Agregar</button>
            </form>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(showManager === "Categories" ? categories : supermarkets).map(item => (
                <div key={item.id} className="group/item flex items-center justify-between rounded-xl border border-transparent bg-zinc-100 px-3 py-2 hover:border-zinc-200 dark:bg-zinc-900 dark:hover:border-zinc-800 transition-all">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 truncate">{item.name}</span>
                  <button 
                    onClick={() => showManager === "Categories" ? handleDeleteCategory(item.id) : handleDeleteSupermarket(item.id)}
                    className="text-rose-500 opacity-0 group-hover/item:opacity-100 hover:scale-110 transition-all"
                  >
                    <Trash2 className="h-4 w-4"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Product Section */}
        {isAddingProduct && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-2 mb-4">
               <div className="h-1px flex-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Nuevo Producto</span>
               <div className="h-1px flex-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent dark:via-zinc-800" />
            </div>
            <AddGroceryItem 
              onAdd={handleAddProduct} 
              categories={categories} 
              supermarkets={supermarkets} 
            />
          </div>
        )}

        {/* Search and Filters */}
        <div className="mb-12 flex flex-col gap-4">
          <div className="relative group">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-emerald-500" />
            <input 
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 w-full rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-base font-medium text-zinc-900 shadow-sm outline-none transition-all focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[150px]">
              <Tag className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <select 
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-white pl-10 pr-10 text-sm font-bold text-zinc-700 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
              >
                <option value="All">Categorias</option>
                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
              </select>
            </div>
            
            <div className="relative flex-1 min-w-[150px]">
              <Store className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-zinc-400 pointer-events-none" />
              <select 
                value={filterSupermarket}
                onChange={(e) => setFilterSupermarket(e.target.value)}
                className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-white pl-10 pr-10 text-sm font-bold text-zinc-700 outline-none focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
              >
                <option value="All">Supermercados</option>
                {supermarkets.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* The List Content */}
        {isLoading ? (
          <div className="flex h-32 items-center justify-center">
             <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-600">
                 {filteredItems.length} Productos Disponibles
               </h2>
               <div className="h-px flex-1 mx-4 bg-zinc-100 dark:bg-zinc-900" />
            </div>
            
            {filteredItems.length === 0 ? (
               <div className="rounded-3xl border border-dashed border-zinc-200 py-16 text-center dark:border-zinc-800 animate-in fade-in duration-700">
                 <p className="text-zinc-500 font-medium">No hay productos que coincidan con tu búsqueda.</p>
               </div>
            ) : (
               <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 scroll-smooth">
                 {filteredItems.map(item => (
                   <div key={item.id} className="animate-reveal-bottom">
                     <GroceryItemRow 
                       item={item} 
                       onDelete={handleDeleteProduct} 
                     />
                   </div>
                 ))}
               </div>
            )}
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-zinc-100 py-12 text-center dark:border-zinc-900">
        <p className="text-sm font-medium text-zinc-400">Hecho con amor por Pedro.</p>
      </footer>
    </div>
  );
}
