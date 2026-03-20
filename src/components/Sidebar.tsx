"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Search, 
  PlusCircle, 
  Store, 
  Tag, 
  LayoutDashboard,
  Menu,
  X,
  ShoppingCart,
  ListTodo
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { name: 'Buscar Productos', href: '/', icon: Search },
  { name: 'Agregar Producto', href: '/products/add', icon: PlusCircle },
  { name: 'Mis Listas', href: '/lists', icon: ListTodo },
  { name: 'Supermercados', href: '/supermarkets', icon: Store },
  { name: 'Categorías', href: '/categories', icon: Tag },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-white border border-zinc-200 shadow-lg text-zinc-600"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-40 h-screen w-64 transition-transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 border-r border-zinc-200/60 bg-white/70 backdrop-blur-2xl
      `}>
        <div className="flex h-full flex-col px-4 py-6">
          <div className="flex items-center gap-3 px-2 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-xl shadow-zinc-900/10">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-black tracking-tight text-zinc-900 leading-none">
              Lista Super
            </h1>
          </div>

          <nav className="flex-1 space-y-1">
            {navigation.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`
                    group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all
                    ${active 
                      ? "bg-zinc-900 text-white shadow-md" 
                      : "text-zinc-600 hover:bg-zinc-100"}
                  `}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-6 border-t border-zinc-100">
            <p className="text-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Hecho con amor por Pedro
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
