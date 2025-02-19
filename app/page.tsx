import RecipeGenerator from "@/components/recipe-generator"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-2 text-green-600">Recipe Explorer</h1>
        <p className="text-center text-muted-foreground mb-8">
          Discover delicious recipes tailored to your preferences
        </p>
        <RecipeGenerator />
      </main>
    </div>
  )
}

