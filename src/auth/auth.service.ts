import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthCredenialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { AccessToken } from 'src/constants/contstants';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(authCredentialsDto: AuthCredenialsDto): Promise<User> {
    return this.userRepository.signup(authCredentialsDto);
  }
  async signIn(authCredentialsDto: AuthCredenialsDto): Promise<AccessToken> {
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );
    if (!username) {
      throw new UnauthorizedException('Invalid Credentials');
    }
    return this.jwtSignToken({ username });
    // return result;
  }

  async jwtSignToken(userPayload: JwtPayload): Promise<AccessToken> {
    const username = userPayload.username;

    const payload: JwtPayload = { username };
    const accessToken = await this.jwtService.sign(payload);
    this.logger.debug(`JWT token generated payload : ${payload} `);

    return { accessToken };
  }
}
