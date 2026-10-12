import { version } from "../../package.json";

/**
 * Sent with reports, to tell which build a player was on. Vercel exposes the commit it built from;
 * locally there's only the package version.
 */
const commit = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA;

export const appVersion = commit ? `${version}+${commit.slice(0, 7)}` : version;
