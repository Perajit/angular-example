export interface User {
  token: string;
  username: string;
  profile: UserProfile;
}

export interface UserProfile {
  firstname: string;
  lastname: string;
}
