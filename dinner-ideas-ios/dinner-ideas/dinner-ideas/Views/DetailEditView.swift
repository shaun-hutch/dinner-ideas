//
//  DetailEditView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 01/02/2025.
//

import SwiftUI

struct DetailEditView: View {
    @Binding var item: DinnerItem
    
    @State private var prepTime: String = ""
    @State private var cookTime: String = ""
    
    @State private var stepTitle: String = ""
    @State private var stepDescription: String = ""
    
    @State private var showPicker: Bool = false
    
    // state type for focus
    @FocusState private var isFocused: Bool
    @FocusState private var focusedField: Field?
    
    enum Field {
        case stepTitle, stepDescription
    }
    
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
                .onTapGesture {
                    isFocused = false
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
                            .submitLabel(.next)
                            
                        Text("minutes")
                    }
                }
                .onTapGesture {
                    isFocused = false
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
                        Text("minutes")
                    }
                }
                .onTapGesture {
                    isFocused = false
                }
                Section(header: Text("Tags")) {
                    HStack {
                        if item.tags.isEmpty {
                            Text("Tap to add tags...")
                            Spacer()
                        } else {
                            ForEach(item.tags) { tag in
                                FoodTagView(tag: tag)
                            }
                        }
                    }
                    .contentShape(RoundedRectangle(cornerRadius: 5))
                    .onTapGesture {
                        print("tapping picker")
                        showPicker = true
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
                .onTapGesture {
                    isFocused = false
                }
                Section(header: Text("New step title & description")) {
                    TextField("Title", text: $stepTitle)
                        .focused($focusedField, equals: .stepTitle)
                        .onSubmit { focusedField = .stepDescription }
                        
                    HStack {
                        TextEditor(text: $stepDescription)
                            .frame(height: 120)
                            .focused($focusedField, equals: .stepDescription)
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
                                focusedField = .stepTitle
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
