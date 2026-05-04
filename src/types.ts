export interface MenuItem {
  nombre: string;
  precio: number;
  opcion?: string;
  opciones?: string[];
  imagen?: string;
  imagenes?: Record<string, string>;
  stock?: boolean;
}

export interface MenuCategory {
  categoria: string;
  items: MenuItem[];
}

export interface CartItem {
  id: string;
  nombre: string;
  variacion?: string;
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
