import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm';   
  
import { User } from './user.entity';
  
import { Competence, StatusProject } from 'src/common/types'; 
import { Team } from './team.entity';

@Entity()
export class Project {
  
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @Column()
    problem: string;

    @Column()
    solution: string;

    @Column()
    result: string;

    @Column()
    resource: string;

    @Column({ type: 'varchar', array: true, default: '{}' })
    stack: Competence[];

    @Column({ default: StatusProject.searchTeam })
    status: StatusProject;
    
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;  

    @Column()
    startProject: Date;

    @Column()
    stopProject: Date;

    @Column()
    maxUsers: string;
    
    @OneToMany(() => Team, (team) => team.project)
    teams: Team[];

    @ManyToOne(() => User, (user) => user.project_customer, { onDelete: 'CASCADE' })
    customer: User;
    
    @ManyToOne(() => User, (user) => user.project_initiator, { onDelete: 'CASCADE' })
    initiator: User;
      
}