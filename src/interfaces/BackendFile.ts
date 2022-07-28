export default interface BackendFile {
  filename: string
  type: string
  path: string
  size: number
  mimetype: string
  icon?: string
  permissions: {
    read: boolean
    write: boolean
    create: boolean
    delete: boolean
  }
};