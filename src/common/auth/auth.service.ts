import { Injectable, Inject, LoggerService } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AV } from '../../common/leancloud';
// import * as Redis from 'ioredis';
// import { RedisService } from 'nestjs-redis';
import { RequestUser } from '../interfaces';

/**
 * 用户认证
 */
@Injectable()
export class AuthService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  /**
   * 检查 token
   *
   * @param  {string} token
   * @param  {string} ip
   * @returns Promise
   */
  async check(token: string, ip: string): Promise<RequestUser> {
    const user = {
      id: null,
      username: '',
      email: '',
      roles: [],
      ip,
      token,
    } as RequestUser;

    if (!token) {
      return user;
    }

    try {
      // todo check token
      const currentUser = await AV.User.become(token);
      user.id = currentUser.getObjectId();
      user.username = currentUser.getUsername();
      user.email = currentUser.getEmail();
      const roles = await currentUser.getRoles();
      user.roles = roles.map((item) => item.getName());
    } catch (error) {
      this.logger.error('decode error with:', token, ip);
    }
    return user;
  }
}
