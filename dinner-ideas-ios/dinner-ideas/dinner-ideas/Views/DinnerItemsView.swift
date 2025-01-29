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
            VStack {
                Text("Welcome to Dinner Ideas!")
                    .padding()
                    .font(.title)
                
            }
            .navigationTitle(Text("Dinner Ideas"))
            .navigationBarTitleDisplayMode(.large)
            
        }
            
        
        
    }
}

#Preview {
    DinnerItemsView()
}
