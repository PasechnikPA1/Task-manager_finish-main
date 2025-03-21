import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Competence, StatusProject, UpdateProjectDto } from 'src/common/types';
import { Project } from 'src/orm/project.entity';
import { User } from 'src/orm/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({ relations: ['teams', 'initiator'] });
  }

  async findOne(id: number): Promise<Project | any> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['teams', 'initiator'],
    });
    return project;
  }

  async create(
    name: string,
    problem: string,
    solution: string,
    result: string,
    resource: string,
    stack: Competence[],
    status: StatusProject.searchTeam,
    startProject: Date,
    stopProject: Date,
    maxUsers: string,
    customer: string,
    initiator: number,
  ): Promise<Project> {
    const project = new Project();
    project.name = name;
    project. problem = problem;
    project.solution = solution;
    project.result = result;
    project.resource = resource;
    project.stack = stack;
    project.status = status;
    project.startProject = startProject;
    project.stopProject = stopProject;
    project.maxUsers = maxUsers;
    project.customer = customer;
    const initiatorEntity = await this.userRepository.findOne({ where: { id: initiator } });

    if (!initiatorEntity) {
        throw new NotFoundException(`Initiator with id ${initiator} not found`);
    }
    project.initiator = initiatorEntity;
    return this.projectRepository.save(project);
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
        throw new NotFoundException(`Project with id ${id} not found`);
    }

    // Обновите поля проекта
    Object.assign(project, updateProjectDto);

    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.projectRepository.findOne({ where: { id } });

    if (!project) {
        throw new NotFoundException(`Project with id ${id} not found`);
    }

    await this.projectRepository.remove(project);
  }
}