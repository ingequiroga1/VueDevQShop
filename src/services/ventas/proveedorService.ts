import { Proveedor } from "../../interfaces/Proveedor";
import { ApiResponse } from "../../types/api";
import { supabase } from "../supabaseClient";


export const crearProveedor = async (proveedor: Proveedor ) : Promise<ApiResponse<Proveedor>> =>{
    const {data,error:crearError} = await supabase 
        .from('proveedores')
        .insert([
            {
            nombre: proveedor.nombre,
            empresa: proveedor.empresa,
            correo: proveedor.correo,
            telefono: proveedor.telefono,
            direccion: proveedor.direccion,
            notas: proveedor.notas,
            imagen: `https://ui-avatars.com/api/?name=${proveedor.nombre}&background=0D8ABC&color=fff`
            },])
        .select(`
            id,
            nombre,
            empresa,
            correo,
            telefono,
            direccion,
            notas,
            imagen
            `)
        
    if (crearError) {
        console.error('Error al crear el proveedor:', crearError);
        return {success: false, error: crearError.message};
    }
    
     const proveedorMap = mapearProveedor(data)
     return {success:true, data: proveedorMap, count: 1}
}

function mapearProveedor(datos:any) {

    const proveedor = (datos || []).map((proveedor:any) =>({
        id: proveedor.id,
        nombre: proveedor.nombre,
        empresa: proveedor.empresa,
        correo: proveedor.correo,
        telefono: proveedor.telefono,
        direccion: proveedor.direccion,
        notas: proveedor.notas,
        imagen: proveedor.imagen,
    })) as Proveedor;
    return proveedor;
}