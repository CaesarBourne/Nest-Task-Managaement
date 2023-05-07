import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    AuthModule,
    // TypeOrmModule.forC([TaskRepository]),
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskRepository],
})
export class TasksModule {}