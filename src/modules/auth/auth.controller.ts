import { Body, Controller, HttpStatus, Request, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { log } from 'console';
import { User } from '../user/entities/user.entity';
import { SignUpUserDto } from './dto/user-signup.dto';

@Controller('auth')
export class AuthController {
  //We inject the user service in the constructor
  constructor(private userService: UserService, private authService: AuthService) {}

  @Post('signup')
  signUpUser(@Body() body: SignUpUserDto, @Request() req, @Res() res: Response) {
    if (body.password !== body.confirmPassword) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Passwords do not match'
      });
    }

    this.userService.findOneByUsername(body.username).then((user: User) => {
      if (user) {
        return res.status(HttpStatus.BAD_REQUEST).json({
          message: 'User already exists'
        });
      }

      if (!user) {
        this.userService.createUser(body).then((user: User) => {
          const { id, username } = user;
          return res.status(HttpStatus.CREATED).json({ id, username });
        });
      }
    });
  }

  /**
   * Route for login
   * The guard is used to protect the route, if the user is not authenticated, the route will not be accessible
   * The LocalAuthGuard will check if the user is authenticated using the local strategy
   * @param req The request object
   * @returns the JWT access token for the user
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Request() req) {
    return this.authService.login(req.user);
  }
}
