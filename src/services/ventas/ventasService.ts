import {supabase} from '../supabaseClient'
import { ProductoPeticion } from '../../interfaces/Producto';
import { ApiResponse } from '../../types/api';

export const guardarVenta = async (total:number, metodoPago:string, cajeroId:number, productos:ProductoPeticion[]):
Promise<ApiResponse<string>> => {
    
        const {data,error} = await supabase
            .rpc('registrar_venta', {
              p_cajero_id: cajeroId,
              p_metodo_pago: metodoPago,
              p_productos: productos,
              p_total: total  
            })

        if (error) {
            console.error("Error al guardar los detalles de la venta:", error);
            return {success: false, error: error.message};
        }

        const mensaje = `Venta generada ${data}`;  

        return {success:true,data:mensaje};
}