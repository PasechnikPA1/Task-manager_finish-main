import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';   
  
import { User } from './user.entity';
  
import { UserCommandStatus } from 'src/common/types'; 
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
}