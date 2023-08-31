import {
  Controller,
  UseGuards,
  Res,
  Request,
  Get,
  HttpStatus,
  Patch,
  BadRequestException,
  Post
} from '@nestjs/common';
import {
  Body,
  Delete,
  Param,
  Put,
  Query,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common/decorators';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserService } from './user.service';
import { Preferences } from './dto/preferences.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getUserProfile(@Request() req, @Res() res: Response) {
    this.userService
      .getUserProfile(req.user)
      .then((user) => {
        return res.status(HttpStatus.OK).json(user);
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }

  @UseGuards(JwtAuthGuard)
  @Put('preferences')
  updateUserPreferences(@Request() req, @Res() res: Response, @Body() body: Preferences) {
    this.userService
      .updatePreferences(req.user, body)
      .then((result) => {
        return res.status(HttpStatus.OK).json(result);
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }
}
