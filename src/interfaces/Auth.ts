export interface AuthResponse {
    data: any | null;
    error: Error | null;
  }

export interface Usuario{
    usuario_id: string;
    nombre: string;
    email: string;
    imagen: string;
    direccion: string
}