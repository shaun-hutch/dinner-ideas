using dinner_ideas_lambda.models;

namespace dinner_ideas_lambda.services;

/// <summary>
/// Provides curated starter recipes for first-time users.
/// Shared between the seed endpoint and any one-off seeding scripts.
/// </summary>
public static class SeedData
{
    public static List<DinnerItem> GetSeedRecipes() =>
    [
        MakeRecipe(
            "One-Pan Chicken & Veggies",
            "Juicy chicken thighs roasted with seasonal vegetables on a single sheet pan. Minimal cleanup, maximum flavour — the perfect weeknight dinner.",
            10, 35,
            [FoodTag.Quick, FoodTag.Cheap, FoodTag.FamilyFriendly],
            [
                ("Preheat & prep", "Preheat oven to 200°C. Line a large baking tray with baking paper."),
                ("Season chicken", "Pat chicken thighs dry with paper towel. Rub with olive oil, salt, pepper, smoked paprika, and garlic powder."),
                ("Chop vegetables", "Cut potatoes into 2cm chunks, carrots into batons, and red onion into wedges. Toss with olive oil, salt, and rosemary."),
                ("Arrange on tray", "Spread vegetables on the tray, nestle chicken thighs among them skin-side up."),
                ("Roast", "Roast for 30–35 minutes until chicken is golden and cooked through (internal temp 74°C). Rest 5 minutes before serving.")
            ],
            [
                ("Chicken thighs (bone-in, skin-on)", 4, Measurement.Amount),
                ("Potatoes", 500, Measurement.Grams),
                ("Carrots", 3, Measurement.Amount),
                ("Red onion", 1, Measurement.Amount),
                ("Olive oil", 3, Measurement.Tablespoon),
                ("Smoked paprika", 2, Measurement.Teaspoon),
                ("Garlic powder", 1, Measurement.Teaspoon),
                ("Dried rosemary", 1, Measurement.Teaspoon)
            ]),

        MakeRecipe(
            "Speedy Beef Stir-Fry",
            "Tender strips of beef with crisp vegetables in a savoury soy-ginger sauce. Faster than takeaway and twice as satisfying.",
            15, 10,
            [FoodTag.Quick, FoodTag.Cheap],
            [
                ("Prep ingredients", "Slice beef sirloin thinly against the grain. Mince garlic and ginger. Slice capsicum and broccoli into bite-sized pieces."),
                ("Make stir-fry sauce", "Combine soy sauce, oyster sauce, cornflour, and ¼ cup water in a small bowl. Whisk until smooth."),
                ("Sear the beef", "Heat 1 tbsp oil in a wok over high heat until smoking. Sear beef in a single layer for 1 minute per side. Remove and set aside."),
                ("Cook vegetables", "Add remaining oil to the wok. Stir-fry garlic and ginger for 30 seconds, then add vegetables. Cook for 3–4 minutes until tender-crisp."),
                ("Combine & serve", "Return beef to the wok, pour in sauce, and toss for 1 minute until glossy. Serve immediately over steamed rice.")
            ],
            [
                ("Beef sirloin steak", 400, Measurement.Grams),
                ("Broccoli florets", 200, Measurement.Grams),
                ("Red capsicum", 1, Measurement.Amount),
                ("Garlic cloves", 3, Measurement.Amount),
                ("Fresh ginger", 2, Measurement.Teaspoon),
                ("Soy sauce", 3, Measurement.Tablespoon),
                ("Oyster sauce", 2, Measurement.Tablespoon),
                ("Cornflour", 1, Measurement.Tablespoon),
                ("Vegetable oil", 2, Measurement.Tablespoon)
            ]),

        MakeRecipe(
            "Creamy Tomato & Basil Pasta",
            "A rich, velvety tomato sauce with fresh basil, finished with a splash of cream. Simple comfort food that never disappoints.",
            5, 20,
            [FoodTag.Quick, FoodTag.Vegetarian, FoodTag.Cheap],
            [
                ("Cook pasta", "Bring a large pot of salted water to the boil. Cook penne according to packet directions until al dente. Reserve ½ cup pasta water before draining."),
                ("Sauté aromatics", "While pasta cooks, heat olive oil in a large pan over medium heat. Sauté minced garlic for 1 minute until fragrant."),
                ("Build the sauce", "Add crushed tomatoes, a pinch of sugar, salt, and pepper. Simmer for 10 minutes, stirring occasionally."),
                ("Finish with cream & basil", "Stir in cream and torn fresh basil leaves. Add drained pasta and toss to coat, adding splashes of reserved pasta water to loosen the sauce if needed."),
                ("Serve", "Divide among bowls and top with grated Parmesan and extra basil.")
            ],
            [
                ("Penne pasta", 300, Measurement.Grams),
                ("Crushed tomatoes", 400, Measurement.Grams),
                ("Garlic cloves", 3, Measurement.Amount),
                ("Fresh basil leaves", 15, Measurement.Amount),
                ("Thickened cream", 100, Measurement.Millilitres),
                ("Olive oil", 2, Measurement.Tablespoon),
                ("Parmesan cheese (grated)", 50, Measurement.Grams),
                ("Sugar", 1, Measurement.Teaspoon)
            ]),

        MakeRecipe(
            "Loaded Beef Nachos",
            "Crispy corn chips piled high with seasoned beef, melted cheese, fresh salsa, and creamy guacamole. Perfect for sharing — or not.",
            10, 15,
            [FoodTag.Quick, FoodTag.FamilyFriendly],
            [
                ("Brown the beef", "Heat a large frying pan over medium-high heat. Cook beef mince, breaking it up with a wooden spoon, until browned."),
                ("Season the mince", "Add taco seasoning and ¼ cup water. Simmer for 3–4 minutes until thickened."),
                ("Layer the nachos", "Spread corn chips on a large baking tray. Scatter seasoned beef over the chips, then top generously with shredded cheese."),
                ("Bake", "Bake at 180°C for 8–10 minutes until cheese is melted and bubbly."),
                ("Add fresh toppings", "Top with diced tomato, sliced jalapeños, sour cream, guacamole, and fresh coriander. Serve immediately.")
            ],
            [
                ("Beef mince", 500, Measurement.Grams),
                ("Corn chips", 300, Measurement.Grams),
                ("Taco seasoning", 2, Measurement.Tablespoon),
                ("Shredded cheese blend", 200, Measurement.Grams),
                ("Tomato (diced)", 2, Measurement.Amount),
                ("Sour cream", 100, Measurement.Millilitres),
                ("Jalapeños (sliced)", 2, Measurement.Amount),
                ("Fresh coriander", 1, Measurement.Amount)
            ]),

        MakeRecipe(
            "Simple Fish Tacos",
            "Lightly spiced white fish in warm tortillas with crunchy slaw and zesty lime crema. Fresh, fast, and full of flavour.",
            15, 10,
            [FoodTag.Quick, FoodTag.LowCarb],
            [
                ("Make the slaw", "Shred red cabbage and grate carrot. Toss with lime juice, a pinch of salt, and chopped coriander. Set aside."),
                ("Make lime crema", "Mix sour cream with lime zest, lime juice, and a pinch of salt. Thin with a little water if needed."),
                ("Season the fish", "Pat fish fillets dry. Rub with cumin, smoked paprika, salt, and a drizzle of olive oil."),
                ("Cook the fish", "Heat a non-stick pan over medium-high heat. Cook fish for 3–4 minutes per side until flaky. Break into large chunks."),
                ("Assemble tacos", "Warm tortillas in a dry pan. Fill with fish, slaw, and a drizzle of lime crema. Serve with lime wedges.")
            ],
            [
                ("White fish fillets (snapper or hoki)", 500, Measurement.Grams),
                ("Small flour tortillas", 8, Measurement.Amount),
                ("Red cabbage", 200, Measurement.Grams),
                ("Carrot", 1, Measurement.Amount),
                ("Lime", 3, Measurement.Amount),
                ("Sour cream", 100, Measurement.Millilitres),
                ("Ground cumin", 1, Measurement.Teaspoon),
                ("Smoked paprika", 1, Measurement.Teaspoon)
            ]),

        MakeRecipe(
            "Vegetable Frittata",
            "A golden, oven-baked egg dish packed with seasonal vegetables and cheese. Equally good hot for dinner or cold for lunch the next day.",
            10, 25,
            [FoodTag.Vegetarian, FoodTag.Cheap, FoodTag.LowCarb, FoodTag.GlutenFree],
            [
                ("Preheat oven", "Preheat oven to 180°C. Grease a 20cm oven-safe frying pan or baking dish."),
                ("Sauté vegetables", "Heat olive oil in the pan over medium heat. Sauté diced onion, capsicum, and courgette for 5 minutes until softened. Add baby spinach and cook until wilted."),
                ("Whisk eggs", "In a large bowl, whisk eggs, milk, salt, pepper, and half the cheese until well combined."),
                ("Combine & bake", "Pour egg mixture over the vegetables in the pan. Sprinkle remaining cheese on top. Transfer to oven and bake for 20–25 minutes until puffed and golden."),
                ("Rest & serve", "Let the frittata rest for 5 minutes before slicing. Serve with a simple green salad.")
            ],
            [
                ("Eggs", 8, Measurement.Amount),
                ("Milk", 60, Measurement.Millilitres),
                ("Onion (diced)", 1, Measurement.Amount),
                ("Red capsicum (diced)", 1, Measurement.Amount),
                ("Courgette (diced)", 1, Measurement.Amount),
                ("Baby spinach", 100, Measurement.Grams),
                ("Cheddar cheese (grated)", 100, Measurement.Grams),
                ("Olive oil", 1, Measurement.Tablespoon)
            ]),

        MakeRecipe(
            "Honey-Soy Salmon Bowl",
            "Glazed salmon fillets on a bed of steamed rice with edamame, avocado, and cucumber. A fresh, balanced bowl that feels like a treat.",
            10, 15,
            [FoodTag.Quick, FoodTag.LowCarb],
            [
                ("Cook rice", "Rinse jasmine rice and cook according to packet directions. Keep warm."),
                ("Make honey-soy glaze", "Whisk together soy sauce, honey, minced garlic, grated ginger, and sesame oil in a small bowl."),
                ("Cook salmon", "Heat a non-stick pan over medium heat. Place salmon fillets skin-side down, cook for 4 minutes. Flip, pour glaze over, and cook 3 more minutes until caramelised."),
                ("Prep fresh toppings", "Slice avocado, cucumber, and spring onions. Cook edamame according to packet directions."),
                ("Assemble bowls", "Divide rice between bowls. Top with salmon, avocado, cucumber, edamame, and spring onion. Drizzle with any remaining glaze and sprinkle sesame seeds.")
            ],
            [
                ("Salmon fillets", 4, Measurement.Amount),
                ("Jasmine rice", 300, Measurement.Grams),
                ("Soy sauce", 3, Measurement.Tablespoon),
                ("Honey", 2, Measurement.Tablespoon),
                ("Garlic clove (minced)", 2, Measurement.Amount),
                ("Fresh ginger (grated)", 1, Measurement.Teaspoon),
                ("Sesame oil", 1, Measurement.Teaspoon),
                ("Avocado", 2, Measurement.Amount),
                ("Cucumber", 1, Measurement.Amount),
                ("Edamame (shelled)", 100, Measurement.Grams)
            ])
    ];

    private static DinnerItem MakeRecipe(
        string name, string description, int prep, int cook,
        FoodTag[] tags,
        (string title, string desc)[] steps,
        (string name, decimal amount, Measurement unit)[] ingredients)
    {
        return new DinnerItem
        {
            Id = Guid.NewGuid(),
            Name = name,
            Description = description,
            PrepTime = prep,
            CookTime = cook,
            Tags = tags,
            Steps = steps.Select((s, i) => new DinnerItemStep
            {
                Id = Guid.NewGuid(),
                StepTitle = s.title,
                StepDescription = s.desc
            }).ToArray(),
            Ingredients = ingredients.Select(i => new Ingredient
            {
                Id = Guid.NewGuid(),
                Name = i.name,
                Amount = i.amount,
                Measurement = i.unit
            }).ToArray(),
            CreatedBy = 0,
            LastModifiedBy = 0,
            CreatedDate = DateTime.UtcNow,
            LastModifiedDate = DateTime.UtcNow,
            Version = 1
        };
    }
}
