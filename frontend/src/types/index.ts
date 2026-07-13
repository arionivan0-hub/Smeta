export interface Position {
  id: number;
  chapter_id: number;
  code: string;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  catalog_item_id?: number;
  order: number;
}

export interface Chapter {
  id: number;
  estimate_id: number;
  code: string;
  name: string;
  order: number;
  positions: Position[];
}

export interface Estimate {
  id: number;
  name: string;
  project_name: string;
  client_name: string;
  location: string;
  created_at: string;
  updated_at: string;
  status: string;
  currency: string;
  chapters: Chapter[];
}

export interface EstimateListItem {
  id: number;
  name: string;
  project_name: string;
  client_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CatalogItem {
  id: number;
  code: string;
  description: string;
  unit: string;
  category: string;
  price: number;
  source: string;
  last_updated: string;
}

export interface Template {
  id: number;
  name: string;
  description: string;
  category: string;
  chapters_json: ChapterData[];
  created_at: string;
}

export interface ChapterData {
  code: string;
  name: string;
  order: number;
  positions: PositionData[];
}

export interface PositionData {
  code: string;
  description: string;
  unit: string;
  quantity: number;
  unit_price: number;
}

export interface Categories {
  [key: string]: string;
}
