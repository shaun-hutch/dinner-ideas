//
//  FoodTag.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 29/01/2025.
//

import Foundation

enum FoodTag: String, CaseIterable, Identifiable, Codable {
    case Quick
    case Vegeterian
    case Vegan
    case GlutenFree
    case Cheap
    case LowCarb
    case FamilyFriendly
   
    var id: String { self.rawValue }
}
