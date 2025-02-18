import {supabase} from '../supabaseClient'
import {AuthResponse} from '../../interfaces/Auth'

//Registrar nuevo usuario con correo y password
export const signUpWithEmailUsuario = async (email:string, password:string, nombre:string): 
Promise<AuthResponse> => {    

   const {data, error } = await supabase.auth.signUp({
       email,
       password,
   });
    
   if (error) {
      return {data: null, error: new Error(`Error al registrar el usuario: ${error.message}`)};  
    }

    const user = data?.user;

    if (user) {

        const {data:userData, error: insertError } = await supabase
        .from('usuarios')
        .insert([ 
            {
                auth_user_id: user.id,
                nombre: nombre,
                nombre_usuario: email,
                rol: 'Cajero'
            }
        ]);
        

        if (insertError) {
            return {data:null, error: new Error(`Error al insertar en la tabla de usuarios: ${insertError.message}`)};
        }
        return {data: userData, error: null};
    }

   return{data,error};
};

//Registrar nuevo Cliente con correo y password
export const signUpWithEmailCliente = async (email:string, password:string, nombre:string, direccion:string): 
Promise<AuthResponse> => {    

   const {data, error } = await supabase.auth.signUp({
       email,
       password,
   });
   if (error) {
      return {data: null, error: new Error(`Error al registrar el cliente: ${error.message}`)};  
    }
    const user = data?.user;

    if (user) {

        const {data:userData, error: insertError } = await supabase
        .from('clientes')
        .insert([ 
            {
                auth_user_id: user.id,
                nombre: nombre,
                nombre_usuario: email,
                direccion: direccion
            }
        ]);
        if (insertError) {
            return {data:null, error: new Error(`Error al insertar en la tabla de usuarios: ${insertError.message}`)};
        }
        return {data: userData, error: null};
    }
   return{data,error};
};

//Actualizar Usuario
export const updateUser = async(pass:string): Promise<AuthResponse> =>{
    const {data,error} = await supabase.auth.updateUser({
        password: pass
    });

     if (error) {
         return {data: null, error: new Error(`Error al actualizar usuario: ${error.message}`)};   
     }
    return {data,error}
}


//inicio de session de usuario con correo electronico y contraseña
export const signInWithEmail = async (email:string, password:string) => {
   const {data, error } = await supabase.auth.signInWithPassword({
       email,
       password,
   });

   if(error) {
       console.log('Error al iniciar sesion', error.message);
   }
   return {data,error};
};

//Cierre de sesion del usuario

export const signOut = async () => {
   const {error} = await supabase.auth.signOut();
   if (error) {
       console.log('Error al cerrar sesión:',error.message);
   }
   return error;
};

//Obtener usuario Actual
export const getCurrentUser = async () => {
   const {data,error} = await supabase.auth.getUser();
   if (error) {
       console.log('Error al obtener el usuario', error.message);
       
   }
   return data?.user || null;
}

export const resetPassword = async (email:string) : Promise<AuthResponse> => {
    const {data,error} = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
        console.error('Error al enviar el correo:', error.message);
        return {data:null, error: new Error(`Error al enviar correo: ${error.message}`)};
    }
    return {data: data, error: null}
}

//Validar si el usuario existe
export const CheckIfUserExists = async (email:string): Promise<boolean> =>
{
    const {data, error} = await supabase
        .from('usuarios')
        .select('usuario_id')
        .eq('nombre_usuario',email)
        .single();
        
    if (error) {
        if (error.message.includes("No rows")) {
            return false;
        }
        // console.error("error al verificar el usuario ", error.message);
        // throw error;
    
    }
    return !!data;
};

export const setSession = async (accessToken:string,refreshToken:string) =>
{
    const {data,error} = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
    });

    if (error) {
        return false
    }
    return !!data; 

}
