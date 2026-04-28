export interface MenuItem {
  nombre: string;
  precio?: number;
}

export interface MenuCategory {
  categoria: string;
  opciones_proteina?: string[];
  precios_por_proteina?: Record<string, number>;
  items: MenuItem[];
}

export interface CartItem {
  id: string;
  nombre: string;
  proteina?: string;
  precio: number;
  cantidad: number;
}

export interface RestaurantInfo {
  nombre: string;
  telefonos: string[];
  whatsapp: string[];
  redes_sociales: {
    tiktok: string;
    facebook: string;
  };
}

export interface MenuData {
  informacion_restaurante: RestaurantInfo;
  menu: MenuCategory[];
}
