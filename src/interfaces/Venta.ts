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