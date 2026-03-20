"use client";

import { useState, useEffect } from "react";
import { PlusCircle, ShoppingCart, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import AddGroceryItem from "@/components/AddGroceryItem";
import type { Category, Supermarket } from "@/types";
import Link from "next/link";

export default function AddProductPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [supermarkets, setSupermarkets] = useState<Supermarket[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const [ { data: catsData }, { data: supersData } ] = await Promise.all([
      supabase.from("categories").select("*").order("name"),
      supabase.from("supermarkets").select("*").order("name")
    ]);
    if (catsData) setCategories(catsData);
    if (supersData) setSupermarkets(supersData);
  };

  const handleAddProduct = async (name: string, categoryId: string, supermarketId: string) => {
    const { data, error } = await supabase
      .from("products")
      .insert([{ name, category_id: categoryId, supermarket_id: supermarketId }])
      .select()
      .single();

    if (data) {
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 3000);
    }
    if (error) console.error("Error adding product:", error);
  };

  return (
    <div className="h-full overflow-y-auto pt-10 pb-10 pr-2 custom-scrollbar animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/10">
            <PlusCircle className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900">
            Agregar Nuevo Producto
          </h1>
        </div>
        <p className="text-zinc-500 font-medium">Define el nombre, categoría y supermercado para tu nuevo artículo.</p>
      </div>

      <div className="relative">
        <AddGroceryItem 
          onAdd={handleAddProduct} 
          categories={categories} 
          supermarkets={supermarkets} 
        />
        
        {isSuccess && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-3xl animate-in zoom-in-95 duration-300 z-10">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-16 w-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="h-10 w-10 animate-reveal-top" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900">¡Producto Agregado!</h3>
                <p className="text-zinc-500 mt-1">El producto se guardó correctamente.</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="px-6 py-3 rounded-xl bg-zinc-900 text-white font-bold text-sm"
                >
                  Agregar otro
                </button>
                <Link 
                  href="/"
                  className="px-6 py-3 rounded-xl bg-zinc-100 text-zinc-600 font-bold text-sm"
                >
                  Ver lista
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
