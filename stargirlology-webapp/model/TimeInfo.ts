
interface TimeInfoCreated {
  dateCreated: number;
  prettyDateCreated: string;
}

interface TimeInfo extends TimeInfoCreated {
  lastModified: number;
  prettyLastModified: string;
}

export { type TimeInfo, type TimeInfoCreated };