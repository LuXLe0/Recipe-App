import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Flame, ChefHat, UtensilsCrossed } from "lucide-react"

interface Ingredient {
  id: number
  name: string
  amount: number
  unit: string
}

interface Step {
  number: number
  step: string
  ingredients?: Ingredient[]
  equipment?: {
    id: number
    name: string
  }[]
}

interface RecipeModalProps {
  recipe: {
    title: string
    readyInMinutes: number
    servings: number
    nutrition: {
      nutrients: {
        name: string
        amount: number
        unit: string
      }[]
    }
    extendedIngredients: Ingredient[]
    analyzedInstructions: {
      steps: Step[]
    }[]
    diets: string[]
    cuisines: string[]
    dishTypes: string[]
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RecipeModal({ recipe, open, onOpenChange }: RecipeModalProps) {
  if (!recipe) return null

  const getCalories = () => {
    const calories = recipe.nutrition.nutrients.find((nutrient) => nutrient.name === "Calories")
    return calories ? Math.round(calories.amount) : null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-green-600">{recipe.title}</DialogTitle>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {recipe.readyInMinutes} mins
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              {recipe.servings} servings
            </div>
            <div className="flex items-center">
              <Flame className="h-4 w-4 mr-1" />
              {getCalories()} cal/serving
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
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
        </DialogHeader>

        <Tabs defaultValue="instructions" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instructions" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Instructions
            </TabsTrigger>
            <TabsTrigger value="ingredients" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Ingredients
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(80vh-250px)] mt-4 rounded-md border p-4">
            <TabsContent value="instructions" className="m-0">
              {recipe.analyzedInstructions[0]?.steps.map((step) => (
                <div key={step.number} className="mb-6">
                  <h3 className="font-medium mb-2">Step {step.number}</h3>
                  <p className="text-muted-foreground">{step.step}</p>
                  {(step.equipment?.length > 0 || step.ingredients?.length > 0) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {step.equipment?.map((item) => (
                        <Badge key={item.id} variant="outline">
                          {item.name}
                        </Badge>
                      ))}
                      {step.ingredients?.map((item) => (
                        <Badge key={item.id} variant="secondary">
                          {item.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="ingredients" className="m-0">
              <div className="grid gap-2">
                {recipe.extendedIngredients.map((ingredient) => (
                  <div key={ingredient.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <span className="capitalize">{ingredient.name}</span>
                    <span className="text-muted-foreground">
                      {ingredient.amount} {ingredient.unit}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

