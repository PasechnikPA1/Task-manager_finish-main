import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { Project } from 'src/orm/project.entity';
import { User } from 'src/orm/user.entity';
import { RolesGuard } from 'src/auth/roles.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User])],
  controllers: [ProjectController],
  exports: [ProjectService],
  providers: [ProjectService, RolesGuard],
})
export class ProjectModule {}