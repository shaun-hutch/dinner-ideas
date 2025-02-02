//
//  FoodTagView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 30/01/2025.
//

import SwiftUI

public struct FoodTagView: View {
    let tag: FoodTag
    
    public var body: some View {
        VStack {
            Text(tag.name)
                .fontWeight(.medium)
                .padding(5)
                .background(tag.color)
                .cornerRadius(10)
                .overlay(RoundedRectangle(cornerRadius: 10).stroke(Color.primary, lineWidth: 2))
        }
    }
}


#Preview {
    FoodTagView(tag: FoodTag.FamilyFriendly)
        .frame(width: 200, height: 50)
        .background(Color.gray.opacity(0.5))
        .colorScheme(.dark)
    
    FoodTagView(tag: FoodTag.Cheap)
        .frame(width: 200, height: 50)
        .background(Color.gray.opacity(0.5))
        .colorScheme(.light)
}
