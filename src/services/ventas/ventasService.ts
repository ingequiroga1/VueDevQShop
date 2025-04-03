import {supabase} from '../supabaseClient'
import { ProductoPeticion } from '../../interfaces/Producto';
import { ApiResponse } from '../../types/api';
import { VentaRespuesta } from '../../interfaces/Venta';

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


export const guardarVenta = async (total:number, metodoPago:string, cajeroId:number, estado:string, productos:ProductoPeticion[]):
Promise<ApiResponse<string>> => {

  let clienteSistema = 11;

        const {data,error} = await supabase
            .rpc('procesar_venta', {
              p_cajero_id: cajeroId,
              p_metodo_pago: metodoPago,
              p_productos: productos,
              p_total: total, 
              p_estado: estado,
              p_cliente: clienteSistema
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