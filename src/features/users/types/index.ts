interface IUser {
  id: string;
  username: string;
  fname: string;
  lname: string;
  email: string;
  isActive: boolean;
  profileUrl: string;
}

export interface IUserState {
  users: IUser[];
}
