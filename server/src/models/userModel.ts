export interface User {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  password?: string;
  idDocumentType: string;
  idDocumentNumber: number;
  rol: string;
}