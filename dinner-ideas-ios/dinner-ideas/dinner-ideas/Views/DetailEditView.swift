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
    
    @State private var showPicker: Bool = false
    
    // state type for focus
    @FocusState private var isFocused: Bool
    
    var body: some View {
        NavigationStack {
            Form {
                Section(header: Text("Name")) {
                    TextField("Enter the recipe name", text: $item.name)
                        .focused($isFocused)
                        .onSubmit { submit() }
                }
                Section(header: Text("Description")) {
                    TextEditor(text: $item.description)
                        .frame(height: 120)
                        .focused($isFocused)
                }
                Section(header: Text("Preparation Time")) {
                    HStack {
                        TextField("Time taken for preparation", text: $prepTime)
                            .keyboardType(.numberPad)
                            .focused($isFocused)
                            .onChange(of: prepTime) {
                                if let intValue = Int(prepTime) {
                                    item.prepTime = intValue
                                }
                            }
                            .onSubmit { submit() }
                        Text("minutes")
                    }
                }
                Section(header: Text("Cooking Time")) {
                    HStack {
                        TextField("Time taken for cooking", text: $cookTime)
                            .keyboardType(.numberPad)
                            .focused($isFocused)
                            .onChange(of: cookTime) {
                                if let intValue = Int(cookTime) {
                                    item.cookTime = intValue
                                }
                            }
                            .onSubmit { submit() }
                        Text("minutes")
                    }
                }
                Section(header: Text("Tags")) {
                    HStack {
                        ForEach(item.tags) { tag in
                            FoodTagView(tag: tag)
                        }
                    }
                    .onTapGesture {
                        showPicker = true
                        print("showing picker")
                    }
                    .sheet(isPresented: $showPicker) {
                        TagPicker(selectedTags: $item.tags)
                    }
                }
                
                Section(header: Text("Steps")) {
                    ForEach(item.steps) { step in
                        VStack(alignment: .leading) {
                            Text(step.stepTitle)
                                .font(.headline)
                            Text(step.stepDescription)
                        }
                    }
                    .onDelete(perform: deleteStep)
                }
                Section(header: Text("New step title & description")) {
                    TextField("Title", text: $stepTitle)
                        .focused($isFocused)
                        .onSubmit { submit() }
                    HStack {
                        TextEditor(text: $stepDescription)
                            .frame(height: 120)
                            .focused($isFocused)
                            .onSubmit { submit() }
                        Button(action: {
                            print("adding item: \(stepTitle), \(stepDescription)")
                            withAnimation {
                                let step = DinnerItemStep(stepTitle: stepTitle, stepDescription: stepDescription)
                                if item.steps.isEmpty {
                                    item.steps = [step]
                                } else {
                                    item .steps.append(step)
                                }
                                stepTitle = ""
                                stepDescription = ""
                            }
                        }) {
                            Image(systemName: "plus.circle")
                        }
                        .disabled(stepButtonDisabled())
                        .allowsHitTesting(true)
                    }
                }
            }
        }
        .onAppear {
            prepTime = String(item.prepTime)
            cookTime = String(item.cookTime)
        }
        .navigationBarTitle(Text(item.name))
        .navigationBarTitleDisplayMode(.large)        
    }
    
    private func deleteStep(at offsets: IndexSet) {
        item.steps.remove(atOffsets: offsets)
    }
    
    private func stepButtonDisabled() -> Bool {
        return
            stepTitle.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty ||
            stepDescription.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty
    }
    
    private func submit() {
        isFocused = false
    }
}




#Preview {
    DetailEditView(item: .constant(DinnerItem.sampleItems[0]))
}
