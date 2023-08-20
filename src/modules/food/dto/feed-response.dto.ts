export interface FeedResponse {
  recipes: Dish[];
}

interface Dish {
  vegetarian: boolean;
  vegan: boolean;
  glutenFree: boolean;
  dairyFree: boolean;
  veryHealthy: boolean;
  veryPopular: boolean;
  preparationMinutes: number;
  cookingMinutes: number;
  aggregateLikes: number;
  healthScore: number;
  sourceName: SourceName;
  id: number;
  title: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl: string;
  image: string;
  imageType: ImageType;
  nutrition: Nutrition;
  summary: string;
  cuisines: string[];
  dishTypes: DishType[];
  diets: string[];
  occasions: string[];
  analyzedInstructions: AnalyzedInstruction[];
  spoonacularSourceUrl: string;
}

export interface AnalyzedInstruction {
  name: string;
  steps: Step[];
}

export interface Step {
  number: number;
  step: string;
  ingredients: Ent[];
  equipment: Ent[];
  length?: Length;
}

export interface Ent {
  id: number;
  name: string;
  localizedName: string;
  image: string;
  temperature?: Length;
}

export interface Length {
  number: number;
  unit: LengthUnit;
}

export enum LengthUnit {
  Celsius = 'Celsius',
  Fahrenheit = 'Fahrenheit',
  Minutes = 'minutes'
}

export enum DishType {
  Dinner = 'dinner',
  Lunch = 'lunch',
  MainCourse = 'main course',
  MainDish = 'main dish',
  SideDish = 'side dish',
  Soup = 'soup'
}

export enum ImageType {
  Jpg = 'jpg'
}

export interface Nutrition {
  nutrients: Flavonoid[];
  properties: Flavonoid[];
  flavonoids: Flavonoid[];
  ingredients: Ingredient[];
  caloricBreakdown: CaloricBreakdown;
  weightPerServing: WeightPerServing;
}

export interface CaloricBreakdown {
  percentProtein: number;
  percentFat: number;
  percentCarbs: number;
}

export interface Flavonoid {
  name: Name;
  amount: number;
  unit: FlavonoidUnit;
  percentOfDailyNeeds?: number;
}

export enum Name {
  Alcohol = 'Alcohol',
  Apigenin = 'Apigenin',
  Caffeine = 'Caffeine',
  Calcium = 'Calcium',
  Calories = 'Calories',
  Carbohydrates = 'Carbohydrates',
  Catechin = 'Catechin',
  Cholesterol = 'Cholesterol',
  Choline = 'Choline',
  Copper = 'Copper',
  Cyanidin = 'Cyanidin',
  Delphinidin = 'Delphinidin',
  Epicatechin = 'Epicatechin',
  Epicatechin3Gallate = 'Epicatechin 3-gallate',
  Epigallocatechin = 'Epigallocatechin',
  Epigallocatechin3Gallate = 'Epigallocatechin 3-gallate',
  Eriodictyol = 'Eriodictyol',
  Fat = 'Fat',
  Fiber = 'Fiber',
  Fluoride = 'Fluoride',
  Folate = 'Folate',
  FolicAcid = 'Folic Acid',
  Gallocatechin = 'Gallocatechin',
  GlycemicIndex = 'Glycemic Index',
  GlycemicLoad = 'Glycemic Load',
  Hesperetin = 'Hesperetin',
  Iron = 'Iron',
  Isorhamnetin = 'Isorhamnetin',
  Kaempferol = 'Kaempferol',
  Luteolin = 'Luteolin',
  Lycopene = 'Lycopene',
  Magnesium = 'Magnesium',
  Malvidin = 'Malvidin',
  Manganese = 'Manganese',
  MonoUnsaturatedFat = 'Mono Unsaturated Fat',
  Myricetin = 'Myricetin',
  NameTheaflavin3Gallate = 'Theaflavin-3-gallate',
  Naringenin = 'Naringenin',
  NetCarbohydrates = 'Net Carbohydrates',
  NutritionScore = 'Nutrition Score',
  Pelargonidin = 'Pelargonidin',
  Peonidin = 'Peonidin',
  Petunidin = 'Petunidin',
  Phosphorus = 'Phosphorus',
  PolyUnsaturatedFat = 'Poly Unsaturated Fat',
  Potassium = 'Potassium',
  Protein = 'Protein',
  Quercetin = 'Quercetin',
  SaturatedFat = 'Saturated Fat',
  Selenium = 'Selenium',
  Sodium = 'Sodium',
  Sugar = 'Sugar',
  Theaflavin = 'Theaflavin',
  Theaflavin33Digallate = "Theaflavin-3,3'-digallate",
  Theaflavin3Gallate = "Theaflavin-3'-gallate",
  Thearubigins = 'Thearubigins',
  TransFat = 'Trans Fat',
  VitaminA = 'Vitamin A',
  VitaminB1 = 'Vitamin B1',
  VitaminB12 = 'Vitamin B12',
  VitaminB2 = 'Vitamin B2',
  VitaminB3 = 'Vitamin B3',
  VitaminB5 = 'Vitamin B5',
  VitaminB6 = 'Vitamin B6',
  VitaminC = 'Vitamin C',
  VitaminD = 'Vitamin D',
  VitaminE = 'Vitamin E',
  VitaminK = 'Vitamin K',
  Zinc = 'Zinc'
}

export enum FlavonoidUnit {
  Empty = '',
  G = 'g',
  Iu = 'IU',
  Kcal = 'kcal',
  Mg = 'mg',
  Unit = '%',
  Μg = 'µg'
}

export interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  nutrients: Flavonoid[];
}

export interface WeightPerServing {
  amount: number;
  unit: FlavonoidUnit;
}

export enum SourceName {
  Foodista = 'Foodista',
  MaplewoodRoad = 'Maplewood Road',
  Spoonacular = 'spoonacular'
}
