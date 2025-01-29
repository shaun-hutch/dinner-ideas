//
//  DinnerItem.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 29/01/2025.
//

import Foundation

struct DinnerItem : BaseItem {
    var createdBy: Int
    var lastModifiedBy: Int
    var createdDate: Date
    var lastModifiedDate: Date
    var version: Int?
    var id: UUID
    var typeAndId: String { return "\(String(describing: DinnerItem.self))|\(id)" }
    
    var name: String
    var description: String
    var prepTime: Int
    var cookTime: Int
    var steps: [DinnerItemStep]
    var tags: [FoodTag]
    var totalTime: Int { return prepTime + cookTime }
    
    init(createdBy: Int, lastModifiedBy: Int, createdDate: Date, lastModifiedDate: Date, version: Int? = nil, id: UUID, name: String, description: String, prepTime: Int, cookTime: Int, steps: [DinnerItemStep], tags: [FoodTag]) {
        self.createdBy = createdBy
        self.lastModifiedBy = lastModifiedBy
        self.createdDate = createdDate
        self.lastModifiedDate = lastModifiedDate
        self.version = version
        self.id = id
        self.name = name
        self.description = description
        self.prepTime = prepTime
        self.cookTime = cookTime
        self.steps = steps
        self.tags = tags
    }
}

extension DinnerItem {
    static func sampleItems() -> [DinnerItem] {
        return [
            DinnerItem(
                createdBy: 1,
                lastModifiedBy: 1,
                createdDate: Date(),
                lastModifiedDate: Date(),
                id: UUID(),
                name: "Spaghetti Bolognese",
                description: "A classic Italian pasta dish with rich meat sauce.",
                prepTime: 15,
                cookTime: 45,
                steps: [
                    DinnerItemStep(stepTitle: "Boil pasta", stepDescription: "Cook pasta in salted boiling water until al dente."),
                    DinnerItemStep(stepTitle: "Prepare sauce", stepDescription: "Sauté onions, garlic, and ground beef, then add tomatoes and simmer.")
                ],
                tags: [.FamilyFriendly, .Cheap]
            ),
            
            DinnerItem(
                createdBy: 2,
                lastModifiedBy: 2,
                createdDate: Date(),
                lastModifiedDate: Date(),
                id: UUID(),
                name: "Grilled Chicken Salad",
                description: "Healthy grilled chicken served with fresh greens.",
                prepTime: 10,
                cookTime: 20,
                steps: [
                    DinnerItemStep(stepTitle: "Grill chicken", stepDescription: "Season and grill chicken breast until cooked through."),
                    DinnerItemStep(stepTitle: "Assemble salad", stepDescription: "Chop fresh vegetables and mix with dressing.")
                ],
                tags: [.LowCarb, .Quick]
            ),
            
            DinnerItem(
                createdBy: 3,
                lastModifiedBy: 3,
                createdDate: Date(),
                lastModifiedDate: Date(),
                id: UUID(),
                name: "Vegetable Stir Fry",
                description: "Quick and easy stir fry loaded with fresh vegetables.",
                prepTime: 10,
                cookTime: 15,
                steps: [
                    DinnerItemStep(stepTitle: "Chop vegetables", stepDescription: "Cut bell peppers, carrots, and broccoli into bite-sized pieces."),
                    DinnerItemStep(stepTitle: "Stir-fry ingredients", stepDescription: "Sauté vegetables in a hot pan with soy sauce and garlic.")
                ],
                tags: [.Vegeterian, .Quick]
            )
        ]
    }
}

