import { Role } from "../enums/rol.enum";

export const RoleDescriptions: Record<Role, string> = {
  [Role.ADMIN]: 'Administrador',
  [Role.USER]: 'Vendedor',
};
