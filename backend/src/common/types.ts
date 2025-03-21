export enum Role {
  admin = 'admin',
  user = 'user',
  customer = 'customer',
  expert = 'expert',
  directorate = 'directorate',
}

export enum UserAccountStatus {
  active = 'active',
  pending = 'pending',
  inactive = 'inactive',
}

export enum UserCommandStatus {
  inTeam = 'In the team',
  expelled = 'Expelled',
}
    
export enum StatusProject {
  searchTeam = 'Search for team',
  teamFound = 'Team found',
}
    
export enum StatusIdea {
  new = 'New',
  underEditing = 'Under Editing',
  underApproval = 'Under Approval',
  approved = 'Approved',
  published = 'Published',
}
    
export enum StatusTeam {
  searchProject = 'Search for a project',
  inProgress = 'In progress',
}
    
export enum PrivacyTeam {
  open = 'Open',
  close = 'Close',
}
    
export enum Competence {
  no = 'No',
  html = 'HTML',
  typescript = 'TypeScript',
  postgresql = 'PostgeSQL',
}

export enum TaskStatus {
  new = 'new',
  inProgress = 'inProgress',
  done = 'done',
}
  
export interface LoginResponseDto {
  access_token: string;
  username: string;
  firstname: string;
  lastname: string;
  roles: Role[];
  userId: number;
}

export interface SignUpRequestDto {
  username: string;
  password: string;
  firstname: string;
  lastname: string;
}

export interface SignupResponseDto {
  success: boolean;
}

export interface CreateUserDto {
  name: string;
  firstname: string;
  lastname: string;
  password: string;
  roles: Role[];
  status: UserAccountStatus;
}

export interface CreateProjectDto {
  name: string;
  problem: string;
  solution: string;
  result: string;
  resource: string;
  stack: Competence[];
  status: StatusProject.searchTeam;
  startProject: Date;
  stopProject: Date;
  maxUsers: string;
  customer: string;
  initiator: number;
}

export interface UpdateProjectDto {
  name: string;
  problem: string;
  solution: string;
  result: string;
  resource: string;
  stack: Competence[];
  status: StatusProject.searchTeam;
  startProject: Date;
  stopProject: Date;
  maxUsers: string;
  customer: string;
  initiator: number;
}

export type SecuredUser = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  group: string;
  telephone: string;
  roles: Role[];
  status: UserAccountStatus;
  competence: Competence[];
  portfolio: PortfolioDto[];
};

export type TaskDto = {
  id: number;
  title: string;
  status: TaskStatus;
  createdAt: Date;
  author: SecuredUser;
  assignee?: any;
};

export type ProjectDto = {
  id: number;
  name: string;
  problem: string;
  solution: string;
  result: string;
  resource: string;
  stack: Competence[]; 
  status: StatusProject; 
  startProject: Date;
  stopProject: Date;
  maxUsers: string;
  teams: TeamDto[];
  customer: string; 
  initiator: SecuredUser; 
};

export type TeamDto = {
  id: number;
  name: string;
  description: string;
  privacy: PrivacyTeam;
  status: StatusTeam;
  user_leader: SecuredUser;
  user: SecuredUser[];
  portfolio: PortfolioDto[];
  project: ProjectDto;
  user_owner: SecuredUser;
}

export type PortfolioDto = {
  id: number;
  entryDate: Date;
  exclusionDate: Date;
  status: UserCommandStatus;
  team: TeamDto;
  user: SecuredUser;
}

export type UpdateUserDto = Omit<CreateUserDto, 'password'>;

export type CreateUpdateTaskDto = Omit<TaskDto, 'id' | 'createdAt' | 'author'>;