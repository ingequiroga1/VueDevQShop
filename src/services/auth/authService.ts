import {supabase} from '../supabaseClient'


//Registrar nuevo usuario con correo y password
export const signUpWithEmail = async (email:string, password:string) => {
    console.log(email,password);
    

   const {data, error } = await supabase.auth.signUp({
       email,
       password,
   });

   if (error) {
       console.log("Error al registrar el usuario:", error.message);
   }
   return{data,error};
};


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