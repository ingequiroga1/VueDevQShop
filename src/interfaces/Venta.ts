export interface VentaRespuesta{
    venta_id:number,
    fecha_venta:Date,
    total:number,
    detalle:VentaDetalle[] | null
}

export interface VentaDetalle{
    producto:string,
    cantidad:number,
    subtotal:number
}

export interface VentaPedido {
    estado: string
    fecha_venta: string
    total: number
    venta_id: number
    usuarios: UsuarioVenta
    ventas_detalle: DetallePedido[]
  }

  interface UsuarioVenta {
    nombre: string
    direccion: string
  }

  interface DetallePedido {
    precio_unitario: number
    productos: {
      nombre: string
    }
}

export interface PedidoMapeado {
    venta_id: number
    estado: string
    fecha_venta: string
    total: number
    cliente: string
    direccion: string
    productos: {
      nombre: string
      precio_unitario: number
    }[]
  }

