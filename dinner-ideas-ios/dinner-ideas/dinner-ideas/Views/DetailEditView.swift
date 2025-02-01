//
//  DetailEditView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 01/02/2025.
//

import SwiftUI

struct DetailEditView: View {
    @Binding var item: DinnerItem
    
    @State private var prepTime: String = "0"
    @State private var cookTime: String = "0"
    
    @State private var stepTitle: String = ""
    @State private var stepDescription: String = ""
    
    var prepTimeNumeric: Int { Int(prepTime) ?? 0 }
    var cookTimeNumeric: Int { Int(cookTime) ?? 0 }
    
    
    
    var body: some View {
        Form {
            Section(header: Text("Name")) {
                TextField("Enter the recipe name", text: $item.name)
            }
            Section(header: Text("Description")) {
                TextEditor(text: $item.description)
                    .frame(height: 120)
            }
            Section(header: Text("Preparation Time")) {
                HStack {
                    TextField("Time taken for preparation", text: $prepTime)
                        .keyboardType(.numberPad)
                    Text("minutes")
                }
            }
            Section(header: Text("Cooking Time")) {
                HStack {
                    TextField("Time taken for cooking", text: $cookTime)
                        .keyboardType(.numberPad)
                    Text("minutes")
                }
            }
            // TODO Tag picker here (multi picker sheet thing)
            
            Section(header: Text("Steps")) {
                ForEach(item.steps) { step in
                    VStack(alignment: .leading) {
                        Text(step.stepTitle)
                            .font(.headline)
                        Text(step.stepDescription)
                    }
                }
            }
            Section(header: Text("New step title & description")) {
                TextField("Title", text: $stepTitle)
                HStack {
                    TextEditor(text: $stepDescription)
                        .frame(height: 120)
                    Button(action: {
                        withAnimation {
                            let step = DinnerItemStep(stepTitle: stepTitle, stepDescription: stepDescription)
                            item.steps.append(step)
                            stepTitle = ""
                            stepDescription = ""
                        }
                    }) {
                        Image(systemName: "plus.circle")
                    }
                    .disabled(stepTitle.isEmpty && stepDescription.isEmpty)
                }
            }
        }
    }
}


#Preview {
    DetailEditView(item: .constant(DinnerItem.sampleItems[0]))
}
