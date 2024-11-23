import { ProductoPeticion, ProductoRespuesta } from '../../interfaces/Producto';
import {supabase} from '../supabaseClient'
import { ApiResponse } from '../../types/api';


export const getProductos = async (): Promise<ApiResponse<ProductoRespuesta[]>> => {
    const {data,error} = await supabase
        .from('productos')
        .select(`
            producto_id,
            nombre,
            codigo_barras,
            descripcion,
            categorias(categoria_id, nombre),
            precio_venta,
            stock,
            stock_minimo
            `)
        .eq('estado','Activo');
        
        if (error) {
            console.error('Error fetching products:', error);
            return {success: false, error: error.message};
        }

    const productos = mapearProducto(data)
    return {success:true, data: productos}
}


export const crearProducto = async (producto: ProductoPeticion) : Promise<ApiResponse<ProductoRespuesta[]>> =>{
    const {data,error:crearError} = await supabase 
        .from('productos')
        .insert([
            {
            codigo_barras: producto.codigo_barras,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            categoria_id: producto.categorias?.categoria_id,
            precio_compra: producto.precio_venta,
            precio_venta: producto.precio_venta,
            stock: producto.stock,
            stock_minimo: 5,
            estado: "Activo",
            },])
        .select(`
            producto_id,
            nombre,
            codigo_barras,
            descripcion,
            precio_venta,
            stock,
            stock_minimo,
            categorias(categoria_id, nombre)
            `)
        
    if (crearError) {
        console.error('Error al crear el producto:', crearError);
        return {success: false, error: crearError.message};
    }
    const productos = mapearProducto(data)
    return {success:true, data: productos}
}

export const deleteProducto = async (idProd:number):Promise<ApiResponse<null>> => {
    //Delete Fisico
    // const {error:deleteError} = await supabase
    //     .from('productos')
    //     .delete()
    //     .eq('producto_id',idProd)

    //Delete Logico
    const {error:deleteError} = await supabase
        .from('productos')
        .update({estado: 'Inactivo'})
        .eq('producto_id',idProd)

    if (deleteError) {
        console.error('Error al eliminar el producto:', deleteError);
        return {success: false, error: deleteError.message}; 
    }

    return{success: true,data: null}    
}

export const editarProducto = async(editProd: ProductoPeticion) : Promise<ApiResponse<null>> => {
    const {error:editError} = await supabase
        .from('productos')
        .update({
            codigo_barras:editProd.codigo_barras,
            nombre: editProd.nombre,
            descripcion: editProd.descripcion,
            categoria_id: editProd.categorias?.categoria_id,
            precio_compra: editProd.precio_venta,
            precio_venta: editProd.precio_venta,
            stock: editProd.stock,
            })
        .eq('producto_id',editProd.producto_id)
        .select()
        
        if (editError) {
            console.error('Error al editar el producto:', editError);
            return {success: false, error: editError.message};   
        }

        return{success: true,data: null}
}

function mapearProducto(datos:any) {

    const productos = (datos || []).map((producto:any) =>({
        producto_id: producto.producto_id,
        nombre: producto.nombre,
        codigo_barras: producto.codigo_barras,
        descripcion: producto.descripcion,
        categorias: producto.categorias
        ? {
            categoria_id: producto.categorias.categoria_id,
            nombre: producto.categorias.nombre,
        }:null,
        precio_venta: producto.precio_venta,
        stock: producto.stock,
        stock_minimo: producto.stock_minimo,
    })) as ProductoRespuesta[];

    return productos;
}