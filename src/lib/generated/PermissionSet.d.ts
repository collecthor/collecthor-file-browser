/* eslint-disable */
/**
 * This file was automatically generated by json-schema-to-typescript.
 * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
 * and run json-schema-to-typescript to regenerate this file.
 */

/**
 * A permission set is a dictionary with string keys and boolean values. Some keys are required and always present. Additional keys are allowed
 */
export interface PermissionSet {
  read: boolean;
  write: boolean;
  create: boolean;
  delete: boolean;
  [k: string]: boolean;
}