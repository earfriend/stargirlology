import { SGUserAcl } from './SGUserAcl';

interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
};

/**
 * Represent a user in the app
 */
export default class SGUSer implements FirebaseUser {
  public readonly uid: string;
  public readonly email: string;
  public readonly displayName: string;
  public readonly photoURL: string | null;
  public readonly acl: SGUserAcl;

  constructor({
    uid,
    email,
    displayName,
    photoURL,
    acl,
  }: {
    uid: string,
    email: string | null,
    displayName: string | null,
    photoURL: string | null,
    acl: SGUserAcl,
  }) {
    this.uid = uid;
    this.email = email || 'email-not-set';
    this.displayName = displayName || 'display-name-not-set';
    this.photoURL = photoURL;;
    this.acl = acl;
  }

  public static newUnInitializedUser(): SGUSer {
    return new SGUSer({
      uid: '',
      email: '',
      displayName: 'Uninitialized User',
      photoURL: '',
      acl: new SGUserAcl({ }),
    });
  }

  public static newGuestUser(): SGUSer {
    return new SGUSer({
      uid: '',
      email: '',
      displayName: 'Guest',
      photoURL: '',
      acl: new SGUserAcl({ }),
    });
  }

  public isGuest(): boolean {
    return this.displayName === 'Guest';
  }

  /** True if initialized and not guest */
  public isNotGuest(): boolean {
    return this.displayName !== 'Guest' && this.displayName !== 'Uninitialized User';
  }
}