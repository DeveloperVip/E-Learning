import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.headers.authorization;

    // Log toàn bộ header Authorization để kiểm tra token
    console.log('Authorization Header:', authorizationHeader);

    // Nếu không có token, log và ném ra lỗi Unauthorized
    if (!authorizationHeader) {
      console.log('No token found in request');
      throw new UnauthorizedException('Token not found');
    }

    const token = authorizationHeader.split(' ')[1];

    try {
      console.log('Extracted JWT Token:', token);
      const decodedToken = this.jwtService.verify(token);
      console.log('Decoded Token:', decodedToken); // Log thông tin từ token
    } catch (err) {
      console.log('Error decoding token:', err); // Log lỗi nếu không thể giải mã token
      throw new UnauthorizedException('Invalid token');
    }

    return super.canActivate(context);
  }
}
