/** How permissions are declares
 * @name The name of the permission, used to access it in the run context
 * @value The value of the permission, can be any type
*/
export interface Permission {
  name: string;
  value: unknown;
}

/** The Object that run ctx uses */
export type PermissionDictionary = Record<string, unknown>;
/** The record that Permissions class uses to store permissions 
 * @string The permission id (to use inside manifest.json)
 * @Permission The permission object
*/
export type PermissionsType = Record<string, Permission>;