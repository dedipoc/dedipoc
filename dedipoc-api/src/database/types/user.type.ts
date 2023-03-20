export interface IUser {
  username: string;
  password: string;
  roles: string[];
  verified?: boolean;
  matchPassword?(password: string): Promise<boolean>;
}
