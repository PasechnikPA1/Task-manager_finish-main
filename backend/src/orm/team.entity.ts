import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
    OneToOne,
    JoinColumn,
} from 'typeorm';   
  
import { User } from './user.entity';
  
import { PrivacyTeam, StatusTeam, TeamDto } from 'src/common/types'; 
import { Portfolio } from './portfolio.entity';
import { Project } from './project.entity';

@Entity()
export class Team {
  
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @Column({ default: '' })
    description: string;
    
    @Column({ default: PrivacyTeam.open})
    privacy: PrivacyTeam;

    @Column({ default: StatusTeam.searchProject })
    status: StatusTeam;
    
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToOne(() => User, { cascade: true })
    @JoinColumn()
    user_leader: User;

    @OneToMany(() => User, (user) => user.team)
    user: User[];

    @OneToMany(() => Portfolio, (portfolio) => portfolio.team)
    portfolio: Portfolio[];

    @ManyToOne(() => Project, (project) => project.teams, { onDelete: 'SET NULL' })
    project: Project;

    @ManyToOne(() => User, (user) => user.team_owner, { onDelete: 'CASCADE' })
    user_owner: User;

    getTeamDto(): TeamDto {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            privacy: this.privacy,
            status: this.status,
            user_leader: this.user_leader.getSecuredDto(),
            user_owner: this.user_owner.getSecuredDto(),
            user: this.user.map(user => user.getSecuredDto()),
            portfolio: this.portfolio.map(portfolio => portfolio.getPortfolioDto()),
            project: this.project.getProjectDto(),
        }
    }
}