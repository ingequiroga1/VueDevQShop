import {supabase} from '../supabaseClient'
import { ProductoPeticion } from '../../interfaces/Producto';
import { ApiResponse } from '../../types/api';
import { PedidoMapeado, VentaPedido, VentaRespuesta } from '../../interfaces/Venta';

export const getVentas = async (): Promise<ApiResponse<VentaRespuesta[]>> => {
  const {data,error,count} = await supabase
  .from('ventas')
  .select(`
    venta_id,
    fecha_venta,
    total,
    ventas_detalle (
      venta_id,
      cantidad,
      subtotal,
      productos (
        producto_id,
        nombre
      )
    )
  `,{count:'exact'})
  .order('fecha_venta', { ascending: false });

  if (error) {
    return {success: false, error: error.message};
  }

  const ventas = mapearVentas(data);
  return {success: true, data: ventas,count:count || 0}
}

export const getVentasPendientes = async (): Promise<ApiResponse<PedidoMapeado[]>> => {
  const { data, error } = await supabase
  .from('ventas')
  .select(`
    estado,
    fecha_venta,
    total,
    venta_id,
    usuarios (
      nombre,
      direccion
    ),
    ventas_detalle (
      precio_unitario,
      productos (
        nombre
      )
    )
  `)
  .eq('estado', 'Pendiente')
 
if (error) {
  return {success: false, error: error?.message || 'Error al obtener los datos'};
}

const ventas = mapearPedidos(data);
return {success: true, data:ventas ,count: data?.length || 0};

}


export const getVentasxFecha = async (fechaini:string,fechafin:string): Promise<ApiResponse<VentaRespuesta[]>> => {
  const {data,error,count} = await supabase
  .from('ventas')
  .select(`
    venta_id,
    fecha_venta,
    total,
    ventas_detalle (
      venta_id,
      cantidad,
      subtotal,
      productos (
        producto_id,
        nombre
      )
    )
  `,{count: 'exact'})
  .gte('fecha_venta',`${fechaini}T00:00:00`) //se agrega date para que tome solo el valor de la fecha sin hora
  .lte('fecha_venta',`${fechafin}T23:59:59`)
  .order('fecha_venta', { ascending: false });

  if (error) {
    return {success: false, error: error.message};
  }

  const ventas = mapearVentas(data);
  return {success: true, data: ventas,count:count || 0}

}


export const guardarVenta = async (total:number, metodoPago:string, usuario:number, estado:string, productos:ProductoPeticion[]):
Promise<ApiResponse<string>> => {

        const {data,error} = await supabase
            .rpc('registrar_venta', {
              p_total: total,
              p_metodo_pago: metodoPago,
              p_usuario_id: usuario,
              p_estado: estado,
              p_productos: productos,
            })

        if (error) {
            console.error("Error al guardar los detalles de la venta:", error);
            return {success: false, error: error.message};
        }

        const mensaje = `Venta generada ${data}`;  

        return {success:true,data:mensaje, count:1};
}


function mapearVentas(datos:any) {

const ventas = (datos || []).map((venta:any) => ({
  venta_id: venta.venta_id,
    fecha_venta: new Date(venta.fecha_venta),
    total: venta.total,
    detalle: Array.isArray(venta.ventas_detalle)
    ? venta.ventas_detalle.map((detalle:any) => ({
      producto: detalle.productos?.nombre || "Producto desconocido",
      cantidad: detalle.cantidad || 0,
      subtotal: detalle.subtotal || 0,
    }))
    : null,
}))

  return ventas;
}

function mapearPedidos(datos: any){

const pedidos = (datos || []).map((pedido: VentaPedido) => ({
  venta_id: pedido.venta_id,
  estado: pedido.estado,
  fecha_venta: new Date(pedido.fecha_venta),
  total: pedido.total,
  cliente: pedido.usuarios == null ? 'Sin nombre' : pedido.usuarios.nombre,
  direccion: pedido.usuarios == null ? 'Sin dirección' : pedido.usuarios.direccion,
  productos: pedido.ventas_detalle.map((detalle: { productos: { nombre: any; }; precio_unitario: any; }) => ({
         nombre: detalle.productos.nombre || 'Sin descripción',
         precio_unitario: detalle.precio_unitario
       }))
}))
  return pedidos;
}
