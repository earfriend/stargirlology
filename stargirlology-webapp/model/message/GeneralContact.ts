export default class GeneralContact {
  public readonly id: string;
  public readonly dateCreated: number;
  public readonly prettyDateCreated: string;
  public readonly prettyLocalDateCreated: string;
  public readonly timestamp: number | object;
  public readonly name: string;
  public readonly email: string;
  public readonly comment: string;
  public readonly currentPage: string;
  public readonly ua: string;

  constructor({
    dateCreated,
    prettyDateCreated,
    prettyLocalDateCreated,
    timestamp,
    name,
    email,
    comment,
    currentPage,
    ua,
  }: {
    dateCreated: number,
    prettyDateCreated: string,
    prettyLocalDateCreated: string,
    timestamp: number | object,
    name: string,
    email: string,
    comment: string,
    currentPage: string,
    ua: string,
  }) {
    this.dateCreated = dateCreated;
    this.prettyDateCreated = prettyDateCreated;
    this.prettyLocalDateCreated = prettyLocalDateCreated;
    this.timestamp = timestamp;
    this.name = name;
    this.email = email;
    this.comment = comment;
    this.currentPage = currentPage;
    this.ua = ua;
    this.id = `${this.timestamp}-${this.name}-${this.email}`;
  }

  public compareTo(other: GeneralContact): number {
    if (typeof this.timestamp === 'object' || typeof other.timestamp === 'object') {
      return -1;
    }
    return this.timestamp - other.timestamp;
  }

  /** Get the timestamp as a local to user's browser string */
  public timestampLocal(): string {
    if (typeof this.timestamp === 'number') {
      return new Date(this.timestamp).toLocaleString();
    }
    return 'invalid timestamp';
  }


  public commentLines(): Array<string> {
    return this.comment.split('\n').filter((line) => line.trim().length > 0);
  }
}