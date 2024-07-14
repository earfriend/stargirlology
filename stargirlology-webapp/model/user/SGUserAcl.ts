interface ISGUserAcl {
  isActive: boolean;
  createdAt: number;
  userAgent: string;
  lastLogin: number;
}

export default class SGUserAcl implements ISGUserAcl {
  public readonly isActive: boolean;
  public readonly createdAt: number;
  public readonly userAgent: string;
  public readonly lastLogin: number;

  constructor({
    isActive,
    createdAt,
    userAgent,
    lastLogin,
  }: {
    isActive?: boolean | null,
    createdAt?: number | null,
    userAgent?: string | null,
    lastLogin?: number | null,
  }) {
    this.isActive = isActive === true;
    this.createdAt = createdAt || Date.now();
    this.lastLogin = lastLogin || Date.now();
    this.userAgent = userAgent || 'not set';
  }
}

export { SGUserAcl };