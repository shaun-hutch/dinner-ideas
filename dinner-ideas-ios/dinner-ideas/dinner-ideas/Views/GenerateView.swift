//
//  GenerateView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 06/03/2025.
//

import SwiftUI

struct GenerateView: View {
    var dinnerItems: [DinnerItem]
    
    @State private var generated: Bool = false
    @State private var generatedItems: [DinnerItem] = []
    @State private var loading: Bool = false
    @State private var generatedDate: Date?
    
    let saveAction: () -> Void
    
    var body: some View {
        VStack {
            Spacer()
            if !generated {
            } else {
                DinnerItemsView(dinnerItems: .constant(generatedItems), saveAction: saveAction)
            }
            Button(action: {
                loading = true
                generateDinnerItems()
                loading = false
                generated = true
            }) {
                withAnimation {
                    HStack {
                        if loading {
                            ProgressView()
                                .progressViewStyle(.circular)
                        } else {
                            Image(systemName: "arrow.trianglehead.2.counterclockwise.rotate.90")
                        }
                        Text("Generate")
                    }
                }
            }
            .padding(10)
        }
        .navigationTitle(generatedDate?.description ?? "Generate")
    }
    
    
    private func generateDinnerItems() {
        let count = min(3, dinnerItems.count)
        generatedItems = Array(dinnerItems.shuffled().prefix(count))
    }
    
}

#Preview {
    GenerateView(dinnerItems: DinnerItem.sampleItems, saveAction: {})
}


