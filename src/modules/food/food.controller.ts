import {
  Controller,
  Request,
  UseGuards,
  Get,
  UseInterceptors,
  Res,
  Body,
  HttpStatus,
  Query,
  Param,
  Post
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';
import { FoodService } from './food.service';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { SearchRequest } from './dto/search-request.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';

@Controller('food')
export class FoodController {
  constructor(private foodService: FoodService) {}

  @UseGuards(JwtAuthGuard)
  //@UseInterceptors(CacheInterceptor)
  //Cache for 3 horus
  //@CacheTTL(10800)
  @Get('feed')
  async getFeed(@Request() req) {
    return this.foodService
      .getFeed(req.user.id)
      .then((feed) => {
        return feed;
      })
      .catch((err) => {
        return { message: err.message };
      });
  }

  @UseGuards(JwtAuthGuard)
  @Get('paginated-feed')
  async getPaginatedFeed(
    @Request() req,
    @Res() res: Response,
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    return this.foodService
      .getPaginatedFeed(req.user.id, pageOptionsDto)
      .then((response) => {
        return res.status(HttpStatus.OK).send(response);
      })
      .catch((err) => {
        return res.status(err.status).json({ message: err.message });
      });
  }

  @UseGuards(JwtAuthGuard)
  @Post('search')
  async search(
    @Request() req,
    @Res() res: Response,
    @Body() body: SearchRequest,
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    return this.foodService
      .search(body, pageOptionsDto)
      .then((response) => {
        return res.status(HttpStatus.OK).send(response);
      })
      .catch((err) => {
        console.log(err);
        return res.status(err.status).json({ message: err.message });
      });
  }

  @UseGuards(JwtAuthGuard)
  @Get('recipeById/:id')
  async recipeById(@Request() req, @Res() res: Response, @Param('id') id: string) {
    return this.foodService
      .recipeById(id)
      .then((response) => {
        return res.status(HttpStatus.OK).send(response);
      })
      .catch((err) => {
        console.log(err);
        return res.status(err.status).json({ message: err.message });
      });
  }
}
