import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from './dto/jwt.output';

@Injectable()
export class AuthService {
  private readonly jwtSecret;

  constructor(private readonly config: ConfigService) {
    this.jwtSecret = this.config.get<string>('JWT_SECRET');
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(userId: string): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: '1h' });
  }

  verifyToken(token: string): JwtPayload {
    try {
      const res: JwtPayload = jwt.verify(token, this.jwtSecret);
      return res;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
