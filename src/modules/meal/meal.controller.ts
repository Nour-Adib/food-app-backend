import { Controller, UseGuards, Res, Request, HttpStatus, Post } from '@nestjs/common';
import { Body, Get } from '@nestjs/common/decorators';
import { Response } from 'express';
import { MealService } from './meal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MealSaveDto } from './dto/meal-save.dto';
import { log } from 'console';

@Controller('meal')
export class MealController {
  constructor(private mealService: MealService) {}

  @UseGuards(JwtAuthGuard)
  @Post('save')
  saveMeal(@Request() req, @Res() res: Response, @Body() body: MealSaveDto) {
    this.mealService
      .saveMeal(req.user, body)
      .then((result) => {
        return res.status(HttpStatus.OK).json(result);
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }

  @UseGuards(JwtAuthGuard)
  @Get('daily-intake')
  getDailyIntake(@Request() req, @Res() res: Response) {
    this.mealService
      .getDailyIntake(req.user)
      .then((result) => {
        return res.status(HttpStatus.OK).json(result);
      })
      .catch((err) => {
        log(err);
        return res.status(err.status).json({ message: err.message });
      });
  }

  @UseGuards(JwtAuthGuard)
  @Get('weekly-intake')
  getWeeklyIntake(@Request() req, @Res() res: Response) {
    this.mealService
      .getWeeklyIntake(req.user)
      .then((result) => {
        return res.status(HttpStatus.OK).json(result);
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }
}
