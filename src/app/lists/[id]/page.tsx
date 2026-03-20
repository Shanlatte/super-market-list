"use client";

import { useState, useEffect, useMemo, use } from "react";
import { 
  Trash2, 
  ListTodo, 
  Plus, 
  Search, 
  ArrowLeft, 
  ShoppingCart,
  X,
  Store,
  Tag,
  Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { ShoppingList, ListItem, GroceryItem } from "@/types";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;

  const [list, setList] = useState<ShoppingList | null>(null);
  const [listItems, setListItems] = useState<ListItem[]>([]);
  const [allProducts, setAllProducts] = useState<GroceryItem[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (listId) {
      fetchData();
    }
  }, [listId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [
        { data: listData },
        { data: itemsData },
        { data: productsData }
      ] = await Promise.all([
        supabase.from("shopping_lists").select("*").eq("id", listId).single(),
        supabase.from("list_items").select("*, products:products(*, categories(name), supermarkets(name))").eq("list_id", listId),
        supabase.from("products").select("*, categories(name), supermarkets(name)").order("name")
      ]);

      if (listData) setList(listData);
      if (itemsData) setListItems(itemsData);
      if (productsData) setAllProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProductToList = async (productId: string) => {
    const { data, error } = await supabase
      .from("list_items")
      .insert([{ list_id: listId, product_id: productId }])
      .select("*, products:products(*, categories(name), supermarkets(name))")
      .single();

    if (data) {
      setListItems([...listItems, data]);
    }
    if (error) {
      if (error.code === "23505") {
        // Already in list
        console.log("Product already in list");
      } else {
        console.error("Error adding product to list:", error);
      }
    }
  };

  const handleRemoveProductFromList = async (itemId: string) => {
    const { error } = await supabase.from("list_items").delete().eq("id", itemId);
    if (!error) {
      setListItems(listItems.filter(item => item.id !== itemId));
    }
  };

  const handleDeleteList = async () => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta lista?")) return;
    
    const { error } = await supabase.from("shopping_lists").delete().eq("id", listId);
    if (!error) {
      router.push("/lists");
    }
  };

  const filteredProducts = useMemo(() => {
    const currentProductIds = new Set(listItems.map(item => item.product_id));
    return allProducts.filter(p => 
      !currentProductIds.has(p.id) && 
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allProducts, listItems, searchQuery]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  if (!list) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <h2 className="text-2xl font-bold">Lista no encontrada</h2>
        <Link href="/lists" className="text-emerald-500 font-bold hover:underline flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver a mis listas
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-500 pt-10 pb-10">
      {/* Header */}
      <div className="flex-shrink-0 mb-8">
        <Link href="/lists" className="inline-flex items-center gap-2 text-zinc-400 font-bold text-xs uppercase tracking-widest hover:text-emerald-500 transition-colors mb-4 group">
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Volver a mis listas
        </Link>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-zinc-900 text-white shadow-xl shadow-zinc-900/10 dark:bg-emerald-500 dark:shadow-emerald-500/10">
              <ListTodo className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                {list.name}
              </h1>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-zinc-500 dark:text-zinc-400 font-bold text-sm">
                  {listItems.length} {listItems.length === 1 ? 'producto' : 'productos'}
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleDeleteList}
            className="p-4 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white transition-all active:scale-95 dark:bg-rose-500/10 dark:hover:bg-rose-500"
            title="Eliminar lista"
          >
            <Trash2 className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 flex-1 overflow-hidden">
        {/* Current List Section */}
        <div className="flex-[1.5] flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Productos en la lista
            </h3>
            <div className="h-px flex-1 mx-6 bg-zinc-100 dark:bg-zinc-800" />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {listItems.length === 0 ? (
              <div className="border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[32px] py-16 text-center">
                <p className="text-zinc-400 font-bold mb-4">¡Tu lista está vacía!</p>
                <button 
                  onClick={() => setIsAdding(true)}
                  className="px-6 py-3 rounded-2xl bg-zinc-900 text-white dark:bg-emerald-500 font-bold text-sm shadow-xl shadow-zinc-900/10 dark:shadow-emerald-500/10 animate-bounce"
                >
                  Agregar productos
                </button>
              </div>
            ) : (
              listItems.map((item) => (
                <div 
                  key={item.id}
                  className="group flex items-center justify-between p-4 rounded-3xl border border-zinc-100 bg-white dark:bg-zinc-950 dark:border-zinc-800 transition-all hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center text-emerald-500">
                      <ShoppingCart className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-black text-zinc-900 dark:text-zinc-50 leading-tight">
                        {item.products?.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-zinc-400">
                          <Tag className="h-2.5 w-2.5" />
                          {item.products?.categories?.name || 'S/C'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-zinc-400">
                          <Store className="h-2.5 w-2.5" />
                          {item.products?.supermarkets?.name || 'S/S'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveProductFromList(item.id)}
                    className="p-3 rounded-xl text-rose-500 bg-rose-50 dark:bg-rose-500/10 sm:text-zinc-300 sm:bg-transparent sm:dark:bg-transparent sm:opacity-0 sm:group-hover:opacity-100 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all active:scale-95"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Products Section */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              Agregar productos
            </h3>
            <div className="h-px flex-1 mx-6 bg-zinc-100 dark:bg-zinc-800" />
          </div>

          <div className="relative mb-4 group">
            <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-zinc-400 group-focus-within:text-emerald-500 transition-colors" />
            <input 
              type="text"
              placeholder="Buscar productos para agregar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 rounded-2xl border border-zinc-200 bg-white pl-12 pr-4 text-sm font-bold text-zinc-900 outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 transition-all shadow-sm"
            />
          </div>

          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-2">
            {filteredProducts.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-3xl">
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                  {searchQuery ? "No se encontraron productos" : "Todos los productos agregados"}
                </p>
              </div>
            ) : (
              filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleAddProductToList(product.id)}
                  className="w-full flex items-center justify-between p-3 rounded-2xl border border-zinc-50 bg-zinc-50/50 hover:bg-white hover:border-emerald-500/30 dark:border-zinc-800/50 dark:bg-zinc-900/50 dark:hover:bg-black transition-all group"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:text-emerald-500 transition-colors shadow-sm">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-zinc-700 dark:text-zinc-200 items-center gap-2 flex">
                        {product.name}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">
                        {product.supermarkets?.name} • {product.categories?.name}
                      </div>
                    </div>
                  </div>
                  <Plus className="h-4 w-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
