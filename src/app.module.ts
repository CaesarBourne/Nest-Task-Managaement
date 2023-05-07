import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { TypeOrmExModule } from './repos/typeorm-ex.module';
import { TaskRepository } from './tasks/task.repository';
import { TasksModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    // TypeOrmExModule.forCustomRepository([TaskRepository]),
    TasksModule,
    AuthModule,
  ],
})
export class AppModule {}
