import { DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  code: string;
  isManager: boolean;
  permissions: string[];
};

/* eslint-disable */
declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
/* eslint-enable */
