"use client"

import { useState } from "react"
import { Loader2, ChefHat, Heart, Clock, Users, Search, Utensils, Flame } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { RecipeModal } from "./recipe-modal"

interface Recipe {
  id: number
  title: string
  image: string
  readyInMinutes: number
  servings: number
  sourceUrl: string
  cuisines: string[]
  diets: string[]
  dishTypes: string[]
  nutrition: {
    nutrients: {
      name: string
      amount: number
      unit: string
    }[]
  }
  extendedIngredients: {
    id: number
    name: string
    amount: number
    unit: string
  }[]
  analyzedInstructions: {
    steps: {
      number: number
      step: string
      ingredients?: {
        id: number
        name: string
      }[]
      equipment?: {
        id: number
        name: string
      }[]
    }[]
  }[]
}

interface SpoonacularResponse {
  results: Recipe[]
}

export default function RecipeGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDiet, setSelectedDiet] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const searchRecipes = async () => {
    if (!searchQuery) return

    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        query: searchQuery,
        ...(selectedDiet && { diet: selectedDiet }),
        ...(selectedCuisine && { cuisine: selectedCuisine }),
        ...(selectedTime && { maxReadyTime: selectedTime }),
      })

      const response = await fetch(`/api/recipes?${params}`)
      const data: SpoonacularResponse = await response.json()
      setRecipes(data.results)
    } catch (error) {
      console.error("Failed to fetch recipes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  const getCalories = (recipe: Recipe) => {
    const calories = recipe.nutrition.nutrients.find((nutrient) => nutrient.name === "Calories")
    return calories ? Math.round(calories.amount) : null
  }

  const openRecipeDetails = (recipe: Recipe) => {
    setSelectedRecipe(recipe)
    setModalOpen(true)
  }

  return (
    <div className="space-y-8">
      <Card className="border-green-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-green-600" />
            Find Recipes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Search Recipes</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search recipes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchRecipes()}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Diet</Label>
              <Select value={selectedDiet} onValueChange={setSelectedDiet}>
                <SelectTrigger>
                  <SelectValue placeholder="Select diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vegetarian">Vegetarian</SelectItem>
                  <SelectItem value="vegan">Vegan</SelectItem>
                  <SelectItem value="gluten free">Gluten Free</SelectItem>
                  <SelectItem value="ketogenic">Ketogenic</SelectItem>
                  <SelectItem value="paleo">Paleo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cuisine</Label>
              <Select value={selectedCuisine} onValueChange={setSelectedCuisine}>
                <SelectTrigger>
                  <SelectValue placeholder="Select cuisine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="italian">Italian</SelectItem>
                  <SelectItem value="mexican">Mexican</SelectItem>
                  <SelectItem value="indian">Indian</SelectItem>
                  <SelectItem value="chinese">Chinese</SelectItem>
                  <SelectItem value="japanese">Japanese</SelectItem>
                  <SelectItem value="thai">Thai</SelectItem>
                  <SelectItem value="mediterranean">Mediterranean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cooking Time</Label>
              <Select value={selectedTime} onValueChange={setSelectedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes or less</SelectItem>
                  <SelectItem value="30">30 minutes or less</SelectItem>
                  <SelectItem value="45">45 minutes or less</SelectItem>
                  <SelectItem value="60">1 hour or less</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-4">
              <Button
                className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                onClick={searchRecipes}
                disabled={isLoading || !searchQuery}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <ChefHat className="mr-2 h-4 w-4" />
                    Search Recipes
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative">
              <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="object-cover w-full h-full" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <CardTitle className="text-xl leading-tight text-green-600">{recipe.title}</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleFavorite(recipe.id)}
                  className={cn("shrink-0", favorites.includes(recipe.id) ? "text-red-500" : "text-gray-400")}
                >
                  <Heart className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {recipe.readyInMinutes} mins
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {recipe.servings} servings
                </div>
                {getCalories(recipe) && (
                  <div className="flex items-center">
                    <Flame className="h-4 w-4 mr-1" />
                    {getCalories(recipe)} cal
                  </div>
                )}
              </div>
              <div className="flex gap-2 flex-wrap">
                {recipe.diets.map((diet) => (
                  <Badge key={diet} variant="secondary" className="bg-green-100 text-green-700">
                    {diet}
                  </Badge>
                ))}
                {recipe.cuisines.map((cuisine) => (
                  <Badge key={cuisine} variant="secondary" className="bg-blue-100 text-blue-700">
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => openRecipeDetails(recipe)}>
                View Recipe
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => window.open(recipe.sourceUrl)}>
                Source
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {recipes.length === 0 && !isLoading && (
        <div className="text-center text-muted-foreground">Search for recipes to get started!</div>
      )}

      <RecipeModal recipe={selectedRecipe} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
