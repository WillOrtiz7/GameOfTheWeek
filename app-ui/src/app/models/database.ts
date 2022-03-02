export interface Database {
  users: User[];
  teams: Team[];
}

export interface User{
  _id: number;
  userName: string;
  password: string;
  profilePic: string;
  votedHome:boolean;
  votedAway:boolean;
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
