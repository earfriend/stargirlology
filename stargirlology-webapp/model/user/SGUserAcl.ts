interface ISGUserAcl {
  isApproved: boolean;
  createdAt: number;
  userAgent: string;
  lastLogin: number;
}

export default class SGUserAcl implements ISGUserAcl {
  public readonly isApproved: boolean;
  public readonly createdAt: number;
  public readonly userAgent: string;
  public readonly lastLogin: number;

  constructor({
    isApproved,
    createdAt,
    userAgent,
    lastLogin,
  }: {
    isApproved?: boolean | null,
    createdAt?: number | null,
    userAgent?: string | null,
    lastLogin?: number | null,
  }) {
    this.isApproved = isApproved === true;
    this.createdAt = createdAt || Date.now();
    this.lastLogin = lastLogin || Date.now();
    this.userAgent = userAgent || 'not set';
  }
}

export { SGUserAcl };