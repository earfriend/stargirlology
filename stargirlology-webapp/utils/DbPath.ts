/**
 * Used for paths in the db.
 */

const prefix = 'prod'

/** Build a path in the db to the string with the proper prefix */
const buildPath = (...bits: Array<string>): string => {
  return `${prefix}/${bits.join('/')}`
}

const transcriptBasic = (episodeNumber: number): string => {
  return buildPath('content', 'transcripts', episodeNumber.toString(), 'basic');
}

const transcriptList = (): string => {
  return buildPath('content', 'transcriptList');
}

const transcriptListItem = (episodeNumber: number): string => {
  return buildPath('content', 'transcriptList', episodeNumber.toString());
}

const user = (userId: string): string => {
  return buildPath('users', userId);
}

const usersAclIsApproved = (userId: string): string => {
  return buildPath('users', userId, 'isApproved');
}

const usersAclCreatedAt = (userId: string): string => {
  return buildPath('users', userId, 'createdAt');
}

const usersAclDisplayName = (userId: string): string => {
  return buildPath('users', userId, 'displayName');
}

const usersAclLastLogin = (userId: string): string => {
  return buildPath('users', userId, 'lastLogin');
}

const usersAclUserAgent = (userId: string): string => {
  return buildPath('users', userId, 'userAgent');
}

const displayName = (displayName: string): string => {
  return buildPath('displayNames', displayName.toLowerCase());
}

export default {
  user,
  usersAclIsApproved,
  usersAclCreatedAt,
  usersAclDisplayName,
  usersAclLastLogin,
  usersAclUserAgent,
  displayName,
  transcriptBasic,
  transcriptList,
  transcriptListItem,
};