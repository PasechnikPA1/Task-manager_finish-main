import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';   
  
import { User } from './user.entity';
  
import { PortfolioDto, UserCommandStatus } from 'src/common/types'; 
import { Team } from './team.entity';

@Entity()
export class Portfolio {
  
    @PrimaryGeneratedColumn()
    id: number;
    
    @CreateDateColumn()
    entryDate: Date;
    
    @UpdateDateColumn()
    exclusionDate: Date;

    @Column({ default: UserCommandStatus.inTeam })
    status: UserCommandStatus;

    @ManyToOne(() => Team, (team) => team.id, { onDelete: 'CASCADE' })
    team: Team;

    @ManyToOne(() => User, (user) => user.portfolio, { onDelete: 'CASCADE' })
    user: User;

    getPortfolioDto(): PortfolioDto{
        return {
            id: this.id,
            entryDate: this.entryDate,
            exclusionDate: this.exclusionDate,
            status: this.status,
            team: this.team.getTeamDto(),
            user: this.user.getSecuredDto(),
        }
    }
}