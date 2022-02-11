export interface Database {
  users: User[];
  teams: Team[];
}

export interface User{
  id: number;
  userName: string;
  password: string;
  profilePic: number;
  bettingRecord: number;
  bettingHistory: string[];
}

export interface Team{
  id: number;
  name: string;
  wins: number;
  losses: number;
  offRank: number;
  defRank: number;
  offPpg: number;
  defPpg: number;
}
