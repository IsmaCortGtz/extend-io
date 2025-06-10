import { Permission, PermissionDictionary, PermissionsType } from "../interfaces/PermissionsType";

export class Permissions {
  private static permissions: PermissionsType = {};

  public static setPermissions(permissionID: string, permissionName: string, value: unknown): void {
    if (Object.keys(this.permissions).includes(permissionID)) {
      throw new Error(`Permission '${permissionID}' already set.`);
    }

    this.permissions[permissionID] = {
      name: permissionName,
      value: value,
    };
  }

  public static getPermissions(permissionName: string): Permission {
    if (!Object.keys(this.permissions).includes(permissionName)) {
      throw new Error(`Permission '${permissionName}' not found.`);
    }

    return this.permissions[permissionName];
  }

  public static getAllPermissions(): PermissionsType {
    return this.permissions;
  }

  public static getPermissionsList(permissionsNames: string[]): PermissionsType {
    const result: PermissionsType = {};
    for (const permissionName of permissionsNames) {
      result[permissionName] = this.getPermissions(permissionName);
    }
    return result;
  }

  public static clearPermissions(): void {
    this.permissions = {};
  }

  public static hasPermission(permissionName: string): boolean {
    return Object.keys(this.permissions).includes(permissionName);
  }

  public static removePermission(permissionName: string): void {
    if (!Object.keys(this.permissions).includes(permissionName)) {
      throw new Error(`Permission '${permissionName}' not found.`);
    }

    delete this.permissions[permissionName];
  }

  public static permissionTypeToArray(permissionType: PermissionsType): PermissionDictionary {
    return Object.values(permissionType).reduce((acc: PermissionDictionary, permission: Permission) => {
      acc[permission.name] = permission.value;
      return acc;
    }, {});
  }
}