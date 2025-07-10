export interface ProductoPeticion{
    producto_id: number;
    nombre: string;
    codigo_barras: string;
    descripcion: string,
    categorias:Categoria,
    precio_venta: number;
    stock: number;
    stock_minimo:number;
    subtotal: number;
    cantidad: number;
}


export interface Categoria {
    categoria_id: number;
    nombre: string;
  }

export interface ProductoRespuesta{
    producto_id: number;
    nombre: string;
    codigo_barras: string;
    descripcion: string;
    categorias: Categoria;
    precio_venta: number;
    stock: number;
    stock_minimo:number;
}