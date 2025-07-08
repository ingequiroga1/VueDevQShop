export interface ProductoPeticion{
    producto_id: number;
    nombre: string;
    codigo_barras: string;
    descripcion: string,
    categorias:Categoria | null,
    precio_venta: number;
    stock: number;
    stock_minimo:number;
    subtotal: number;
    cantidad: number;
    idproveedor: string | null;
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
    categorias: Categoria | null;
    precio_venta: number;
    stock: number;
    stock_minimo:number;
    idproveedor: string | null;
}