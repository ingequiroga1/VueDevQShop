import { Proveedor } from "../../interfaces/Proveedor";
import { ApiResponse } from "../../types/api";
import { supabase } from "../supabaseClient";


export const getProveedores = async (searchQuery: string, currentPage: number, pageSize: number): Promise<ApiResponse<Proveedor[]>> => {
    let query = supabase
        .from('proveedores')
        .select(`
            id,
            nombre,
            empresa,
            correo,
            telefono,
            direccion,
            notas,
            imagen
        `, { count: 'exact' })
        .eq('estado', 'Activo')

    if(searchQuery.trim()){
        query.ilike('empresa',`%${searchQuery}%`)
    }else{
        const from = (currentPage-1)*pageSize
        const to = from+pageSize-1
        query = query.range(from,to)
    }

     const {data,error,count} = await query
        if (error) {
            console.error('Error fetching products:', error);
            return {success: false, error: error.message};
        }

    const proveedores = mapearProveedor(data)
    return {success:true, data: proveedores, count: count || 0}


}


export const crearProveedor = async (proveedor: Proveedor ) : Promise<ApiResponse<Proveedor[]>> =>{
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
            imagen: `https://ui-avatars.com/api/?name=${proveedor.empresa}&background=0D8ABC&color=fff`
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

export const eliminarProveedor = async (idProv:string):Promise<ApiResponse<null>> => {

    const {error:deleteError} = await supabase
        .from('proveedores')
        .update({estado: 'Inactivo'})
        .eq('id',idProv)

    if (deleteError) {
        console.error('Error al eliminar el proveedor:', deleteError);
        return {success: false, error: deleteError.message}; 
    }

    return{success: true,data: null, count: 0}    
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
    })) as Proveedor[];
    return proveedor;
}