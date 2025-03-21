import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Project } from 'src/orm/project.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { CreateProjectDto, Role, UpdateProjectDto } from 'src/common/types';
import { RolesGuard } from 'src/auth/roles.guard';


@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Project[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: number): Promise<Project> {
    return this.projectService.findOne(id);
  }

  @Post()
  @Roles(Role.admin, Role.customer, Role.directorate)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(@Body() project: CreateProjectDto): Promise<Project> {
    return this.projectService.create(
      project.name,
      project. problem,
      project.solution,
      project.result,
      project.resource,
      project.stack,
      project.status,
      project.startProject,
      project.stopProject,
      project.maxUsers,
      project.customer,
      project.initiator,
    );
  }

  @Patch(':id')
  @Roles(Role.admin, Role.customer, Role.directorate)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Param('id') id: number, @Body() updateProjectDto: UpdateProjectDto): Promise<Project> {
      return this.projectService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(Role.admin, Role.directorate) 
  @UseGuards(JwtAuthGuard, RolesGuard)
  async remove(@Param('id') id: number): Promise<void> {
      return this.projectService.remove(id);
  }
}