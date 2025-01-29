//
//  DinnerItemsView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 28/01/2025.
//

import SwiftUI

struct DinnerItemsView: View {
    @Binding var dinnerItems: [DinnerItem]
    
    var body: some View {
        NavigationStack {
            List($dinnerItems) { $dinnerItem in
                Text(dinnerItem.name)
                    .font(.headline)
                Text(dinnerItem.description)
                    .font(.caption)
                Text("\(dinnerItem.prepTime) mins")
                
            }
            .navigationTitle(Text("Dinner Ideas"))
            .navigationBarTitleDisplayMode(.large)
            
        }
    }
}

#Preview {
    DinnerItemsView(dinnerItems: .constant(DinnerItem.sampleItems()))
}
