export interface IUser {
  username: string;
  password: string;
  roles: string[];
  sessionToken: string | null;
  matchPassword?(password: string): Promise<boolean>;
}
