import type { ACLPermissions } from './ACLPermissions';

interface ISGUserAcl {
  isApproved: boolean;
  createdAt: number;
  userAgent: string;
  lastLogin: number;
}


export default class SGUserAcl implements ISGUserAcl {
  public readonly isApproved: boolean;
  public readonly isAdmin: boolean;
  public readonly createdAt: number;
  public readonly userAgent: string;
  public readonly lastLogin: number;

  constructor({
    isApproved,
    isAdmin,
    createdAt,
    userAgent,
    lastLogin,
  }: {
    isApproved?: boolean | null,
    isAdmin?: boolean | null,
    createdAt?: number | null,
    userAgent?: string | null,
    lastLogin?: number | null,
  }) {
    this.isApproved = isApproved === true;
    this.isAdmin = isAdmin === true;
    this.createdAt = createdAt || Date.now();
    this.lastLogin = lastLogin || Date.now();
    this.userAgent = userAgent || 'not set';
  }

  public isPermitted(permission: ACLPermissions): boolean {
    if (!this.isApproved) return false;

    switch (permission) {
      case 'ADMIN_PAGE':
        return this.isApproved;
      case 'ADMIN_CONTACTS':
        return this.isApproved && this.isAdmin;
      default:
        return false;
    };
  }
}

export { SGUserAcl };