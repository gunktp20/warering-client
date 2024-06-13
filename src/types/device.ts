export interface IDevice {
  id?: string;
  userID?: string;
  nameDevice?: string;
  usernameDevice?: string;
  password_hash?: string;
  password_law?: string;
  description?: string;
  permission?: string;
  topics?: string[];
  action?: string;
  qos?: 0 | 1 | 2;
  retain?: boolean;
  isSaveData?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
