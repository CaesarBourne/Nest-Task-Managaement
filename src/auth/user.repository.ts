import {
  ConflictException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CustomRepository } from 'src/repos/typeorm-ex.decorator';
import { DataSource, Repository } from 'typeorm';
import { AuthCredenialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';

@CustomRepository(User)
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async signup(authCredentialsDto: AuthCredenialsDto): Promise<User> {
    const { username, password } = authCredentialsDto;

    const user = new User();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);

    //first style without entity  of validating duplicate usernames
    // const exists = this.findOne({username})
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return user;
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredenialsDto,
  ): Promise<string> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOneBy({ username });

    if (user && (await user.validatePassword(password))) {
      return user.username;
    }
  }
  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }
}
