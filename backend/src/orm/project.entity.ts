import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    OneToMany,
    ManyToOne,
} from 'typeorm';   
  
import { User } from './user.entity';
  
import { Competence, ProjectDto, StatusProject } from 'src/common/types'; 
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

    @Column()
    customer: string;
    
    @OneToMany(() => Team, (team) => team.project)
    teams: Team[];

    @ManyToOne(() => User, (user) => user.project_initiator, { onDelete: 'CASCADE' })
    initiator: User;
    
    getProjectDto(): ProjectDto {
        return {
            id: this.id,
            name: this.name,
            problem: this.problem,
            solution: this.solution,
            result: this.result,
            resource: this.resource,
            stack: this.stack,
            status: this.status,
            startProject: this.startProject,
            stopProject: this.stopProject,
            maxUsers: this.maxUsers,
            teams: this.teams.map(team => team.getTeamDto()), // Предполагается, что у Team есть метод getDto
            customer: this.customer, // Предполагается, что у User есть метод getSecuredDto
            initiator: this.initiator.getSecuredDto(),
        };
    }
}