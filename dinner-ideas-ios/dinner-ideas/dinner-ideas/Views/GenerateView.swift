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
    
    var body: some View {
        VStack {
            Spacer()
            if !generated {
            } else {
                
            }
            Button(action: {
                generated = true
                loading = true
                
                DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                    loading = false
                }
                    
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
    }
}

#Preview {
    GenerateView(dinnerItems: DinnerItem.sampleItems)
}
