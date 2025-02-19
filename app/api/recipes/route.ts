import type { NextRequest } from "next/server"

const SPOONACULAR_API_KEY = "a3144fceb4024046b27f60470f14454a"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query") || ""
  const diet = searchParams.get("diet") || ""
  const cuisine = searchParams.get("cuisine") || ""
  const maxReadyTime = searchParams.get("maxReadyTime") || ""

  try {
    const params = new URLSearchParams({
      apiKey: SPOONACULAR_API_KEY,
      query,
      ...(diet && { diet }),
      ...(cuisine && { cuisine }),
      ...(maxReadyTime && { maxReadyTime }),
      number: "9",
      addRecipeInformation: "true",
      fillIngredients: "true",
      instructionsRequired: "true",
      addRecipeNutrition: "true",
    })

    const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${params}`)

    if (!response.ok) {
      throw new Error("Failed to fetch recipes")
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    return Response.json({ error: "Failed to fetch recipes" }, { status: 500 })
  }
}

