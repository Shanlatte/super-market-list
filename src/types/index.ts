export interface Category {
  id: string;
  name: string;
}

export interface Supermarket {
  id: string;
  name: string;
}

export interface GroceryItem {
  id: string;
  name: string;
  category_id: string;
  supermarket_id: string;
  created_at?: string;
  // Join fields for UI (Supabase relational queries)
  categories?: { name: string };
  supermarkets?: { name: string };
}
