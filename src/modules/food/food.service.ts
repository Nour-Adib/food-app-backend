import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { SearchRecipesRequest } from './dto/search-recipes-request.dto';
import { Dish, FeedResponse } from './dto/feed-response.dto';
import { SearchRequest } from './dto/search-request.dto';
import { SearchResponse } from './dto/search-response.dto';
import { PageOptionsDto } from 'src/common/dto/page-options.dto';
import { PageDto } from 'src/common/dto/page.dto';
import { PageMetaDto } from 'src/common/dto/page-meta.dto';
import { RecipeResponse } from './dto/recipe-response.dto';
import { SimplifiedRecipeResponse } from './dto/simplified-recipe-response.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { DietType } from 'src/constants/diet-type.enum';
import { Intolerance } from 'src/constants/Intolerance.enum';
dotenv.config();

@Injectable()
export class FoodService {
  constructor(private httpService: HttpService, private userService: UserService) {}

  baseUrl = 'https://api.spoonacular.com';
  apiKey = process.env?.SPOONACULAR_API_KEY;

  async getFeed(user: User): Promise<FeedResponse> {
    const sortOption = 'healthiness';
    const mealType = this.getMealType();

    const { diet, intolerances } = await this.userService.getUserPreferences(user.id);

    const params = {
      apiKey: this.apiKey,
      type: mealType,
      instructionsRequired: true,
      addRecipeInformation: true,
      addRecipeNutrition: true,
      diet: diet,
      intolerances: intolerances,
      sort: sortOption,
      number: 10,
      offset: this.getRandomNumber(0, 10)
    };

    intolerances == Intolerance.NONE ? delete params.intolerances : null;
    diet == DietType.NONE ? delete params.diet : null;

    const config = {
      method: 'get',
      params: params,
      url: `${this.baseUrl}/recipes/complexSearch`
    };

    const response: SearchRecipesRequest = await this.httpService
      .axiosRef(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        return {};
      });

    console.log(response);

    return this.transformIntoFeedResponse(response);
  }

  async getPaginatedFeed(user: User, pageOptionsDto: PageOptionsDto): Promise<PageDto<Dish>> {
    const sortOption = 'healthiness';
    const mealType = this.getMealType();

    const { diet, intolerances } = await this.userService.getUserPreferences(user.id);

    const params = {
      apiKey: this.apiKey,
      type: mealType,
      instructionsRequired: true,
      addRecipeInformation: true,
      addRecipeNutrition: true,
      diet: diet,
      intolerances: intolerances,
      sort: sortOption,
      number: 10,
      offset: pageOptionsDto.page * pageOptionsDto.skip
    };

    intolerances == Intolerance.NONE ? delete params.intolerances : null;
    diet == DietType.NONE ? delete params.diet : null;

    const config = {
      method: 'get',
      params: params,
      url: `${this.baseUrl}/recipes/complexSearch`
    };

    const response: SearchRecipesRequest = await this.httpService
      .axiosRef(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        return {};
      });

    const feedResponse = this.transformIntoFeedResponse(response);

    const itemCount: number = feedResponse.recipes.length < 10 ? feedResponse.recipes.length : 100;

    const entities: Dish[] = feedResponse.recipes;

    const pageMetaDto: PageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  getMealType(): string {
    const now = new Date();
    const currentTime = now.getHours();
    const isRestDay = now.getDay() == 0;

    if (isRestDay) {
      if (currentTime < 12) {
        return 'breakfast';
      } else {
        return 'main course';
      }
    } else {
      if (currentTime < 12) {
        return 'breakfast';
      } else if (currentTime < 17) {
        return 'salad';
      } else {
        return 'dessert';
      }
    }
  }

  transformIntoFeedResponse(response: SearchRecipesRequest): FeedResponse {
    const feedResponse: FeedResponse = {
      recipes: []
    };

    response.results.forEach((recipe) => {
      feedResponse.recipes.push({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        imageType: recipe.imageType,
        summary: recipe.summary,
        readyInMinutes: recipe.readyInMinutes,
        servings: recipe.servings,
        sourceUrl: recipe.sourceUrl,
        healthScore: recipe.healthScore,
        analyzedInstructions: recipe.analyzedInstructions,
        vegetarian: recipe.vegetarian,
        vegan: recipe.vegan,
        glutenFree: recipe.glutenFree,
        dairyFree: recipe.dairyFree,
        veryHealthy: recipe.veryHealthy,
        veryPopular: recipe.veryPopular,
        preparationMinutes: recipe.preparationMinutes,
        cookingMinutes: recipe.cookingMinutes,
        aggregateLikes: recipe.aggregateLikes,
        sourceName: recipe.sourceName,
        nutrition: recipe.nutrition,
        cuisines: recipe.cuisines,
        dishTypes: recipe.dishTypes,
        diets: recipe.diets,
        occasions: recipe.occasions,
        spoonacularSourceUrl: recipe.spoonacularSourceUrl
      });
    });

    return feedResponse;
  }

  async search(
    body: SearchRequest,
    pageOptionsDto: PageOptionsDto
  ): Promise<PageDto<SearchResponse>> {
    const ingredients = this.formatIngredients(body.ingredients);

    const config = {
      method: 'get',
      params: {
        apiKey: this.apiKey,
        ingredients: ingredients,
        number: pageOptionsDto.take
      },
      url: `${this.baseUrl}/recipes/findByIngredients`
    };

    const response = await this.httpService
      .axiosRef(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        return {};
      });

    const itemCount: number = response.length < 10 ? response.length : 100;

    const entities: SearchResponse[] = response;

    const pageMetaDto: PageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  formatIngredients(ingredients: string[]): string {
    let formattedIngredients = '';

    ingredients.forEach((ingredient) => {
      formattedIngredients += ingredient + ',';
    });

    return formattedIngredients;
  }

  async recipeById(id: string): Promise<SimplifiedRecipeResponse> {
    const config = {
      method: 'get',
      params: {
        apiKey: this.apiKey,
        includeNutrition: true
      },
      url: `${this.baseUrl}/recipes/${id}/information`
    };

    const response = await this.httpService
      .axiosRef(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.log(error);
        return {};
      });

    return this.transformIntoSimplifiedRecipeResponse(response);
  }

  transformIntoSimplifiedRecipeResponse(response: RecipeResponse): SimplifiedRecipeResponse {
    const simplifiedRecipeResponse = {
      id: response.id,
      title: response.title,
      image: response.image,
      imageType: response.imageType,
      summary: response.summary,
      readyInMinutes: response.readyInMinutes,
      servings: response.servings,
      sourceUrl: response.sourceUrl,
      healthScore: response.healthScore,
      analyzedInstructions: response.analyzedInstructions,
      vegetarian: response.vegetarian,
      vegan: response.vegan,
      glutenFree: response.glutenFree,
      dairyFree: response.dairyFree,
      veryHealthy: response.veryHealthy,
      veryPopular: response.veryPopular,
      preparationMinutes: response.preparationMinutes,
      cookingMinutes: response.cookingMinutes,
      aggregateLikes: response.aggregateLikes,
      sourceName: response.sourceName,
      nutrition: response.nutrition,
      cuisines: response.cuisines,
      dishTypes: response.dishTypes,
      diets: response.diets,
      instructions: response.instructions,
      extendedIngredients: response.extendedIngredients,
      originalId: response.originalId,
      spoonacularSourceUrl: response.spoonacularSourceUrl
    };

    return simplifiedRecipeResponse;
  }

  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
