import { ProductoPeticion, ProductoRespuesta } from '../../interfaces/Producto';
import {supabase} from '../supabaseClient'
import { ApiResponse } from '../../types/api';



export const getProductos = async (searchQuery:string,currentPage:number,pageSize:number): Promise<ApiResponse<ProductoRespuesta[]>> => {
    let query = supabase
         .from('productos')
         .select(`
             producto_id,
             nombre,
             codigo_barras,
             descripcion,
             categorias(categoria_id, nombre),
             precio_venta,
             stock,
             stock_minimo,
             id_proveedor
             `,{count:'exact'})
         .eq('estado','Activo')

    if(searchQuery.trim()){
        query.ilike('nombre',`%${searchQuery}%`)
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

    const productos = mapearProducto(data)
    return {success:true, data: productos, count: count || 0}
}

export const getProductoxCB = async (codigo_barras: string): Promise<ApiResponse<ProductoRespuesta>> => {
    try {
        const { data, error } = await supabase
        .from('productos')
        .select(`
            producto_id,
            nombre,
            codigo_barras,
            descripcion,
            categorias(categoria_id, nombre),
            precio_venta,
            stock,
            stock_minimo,
            id_proveedor
        `)
        .eq('codigo_barras', codigo_barras)
        .eq('estado', 'Activo')
        .single(); // Asegura que solo devuelva un objeto, no un array

        if (error) {
            console.error('Error fetching products:', error);
            return { success: false, error: error.message };
        }

        if (!data) {
            return { success: false, error: 'Producto no encontrado' };
        }

        const productoMapeado = mapearProducto([data])[0];
        return { success: true, data: productoMapeado, count: 1 };
    }catch (err) {
        console.error('Unexpected error:', err);
        return { success: false, error: 'Error inesperado' };
    }
}

export const getProductoxProv = async (idProveedor: string): Promise<ApiResponse<ProductoRespuesta[]>> => {
    try {
        const { data, error } = await supabase
        .from('productos')
        .select(`
            producto_id,
            nombre,
            codigo_barras,
            descripcion,
            categorias(categoria_id, nombre),
            precio_venta,
            stock,
            stock_minimo,
            id_proveedor
        `)
        .eq('id_proveedor', idProveedor)
        .eq('estado', 'Activo')

        if (error) {
            console.error('Error fetching products:', error);
            return { success: false, error: error.message };
        }

        if (!data) {
            return { success: false, error: 'Producto no encontrado' };
        }

        const productosMapeados = mapearProducto(data);
        return { success: true, data: productosMapeados, count: productosMapeados.length };
    }catch (err) {
        console.error('Unexpected error:', err);
        return { success: false, error: 'Error inesperado' };
    }
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
            id_proveedor: producto.idproveedor || null,
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
            categorias(categoria_id, nombre),
            id_proveedor
            `)
        
    if (crearError) {
        console.error('Error al crear el producto:', crearError);
        return {success: false, error: crearError.message};
    }
    const productos = mapearProducto(data)
    return {success:true, data: productos, count: productos.length}
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

    return{success: true,data: null, count: 0}    
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
            id_proveedor: editProd.idproveedor,            
            })
        .eq('producto_id',editProd.producto_id)
        .select()
        
        if (editError) {
            console.error('Error al editar el producto:', editError);
            return {success: false, error: editError.message};   
        }

        return{success: true,data: null , count: 0}
}

function mapearProducto(datos:any) {

    const productos = (datos || []).map((producto:any) =>({
        producto_id: producto.producto_id,
        nombre: producto.nombre,
        codigo_barras: producto.codigo_barras,
        descripcion: producto.descripcion,
        categorias: {
          categoria_id: producto.categorias.categoria_id,
          nombre: producto.categorias.nombre,
        },
        precio_venta: producto.precio_venta,
        stock: producto.stock,
        stock_minimo: producto.stock_minimo,
        idproveedor: producto.id_proveedor || null,
    })) as ProductoRespuesta[];

    return productos;
}