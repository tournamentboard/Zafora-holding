export enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  IN_PROGRESS = "in_progress",
  QUALIFIED = "qualified",
  DISQUALIFIED = "disqualified",
  CLOSED = "closed",
}

export enum AuditAction {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LOGIN = "login",
  LOGOUT = "logout",
  CHANGE_PASSWORD = "change_password",
}

export enum UserRole {
  ADMIN = "admin",
}

export enum DocumentVisibility {
  PUBLIC = "public",
  PRIVATE = "private",
}
