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
                NavigationLink(destination: DetailView(item: $dinnerItem)) {
                    DinnerItemCardView(item: dinnerItem)
                }
                
            }
            .navigationTitle(Text("Dinner Ideas"))
            .navigationBarTitleDisplayMode(.large)
        }
    }
}

#Preview {
    DinnerItemsView(dinnerItems: .constant(DinnerItem.sampleItems))
}
