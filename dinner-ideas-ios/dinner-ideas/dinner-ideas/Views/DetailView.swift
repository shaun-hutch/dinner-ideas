//
//  DetailView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 01/02/2025.
//

import SwiftUI

struct DetailView: View {
    @Binding var item: DinnerItem
    
    @State var itemImage: UIImage?
    @State var tempImage: UIImage?
    
    @State private var editingItem = DinnerItem.emptyDinnerItem
    @State private var isPresentingEditView = false
    
    var body: some View {
        ZStack {
            if let image = itemImage {
                Image(uiImage: image)
                    .resizable()
                    .blur(radius: 20)
                    .opacity(0.7)
            } else {
                Rectangle()
                    .fill(Color.gray.opacity(0.3))
                    .blur(radius: 20)
                    .opacity(0.7)
            }
            
            List {
                VStack {
                    DinnerItemImageView(canEdit: false, imageGenerationConcept: .constant(""), selectedImage: $tempImage)
                        .frame(maxWidth: .infinity, alignment: .center)
                        .id(item.image)
                }.listRowBackground(Color.clear)
                Section(header: Text("Description")) {
                    Text(item.description)
                }
                Section(header: HStack {
                    Text("Prep Time")
                    Text("Cook Time")
                        .frame(maxWidth: .infinity, alignment: .trailing)
                }) {
                    HStack {
                        Text(DinnerItem.formatTimeToHoursAndMinutes(time: item.prepTime))
                        Text(DinnerItem.formatTimeToHoursAndMinutes(time: item.cookTime))
                            .frame(maxWidth: .infinity, alignment: .trailing)
                    }
                    
                }
                Section(header: Text("Total Time")) {
                    Text(DinnerItem.formatTimeToHoursAndMinutes(time: item.totalTime))
                }
                Section(header: Text("Tags")) {
                    HStack {
                        ForEach(item.tags, id: \.self.id) { tag in
                            FoodTagView(tag: tag)
                        }
                    }
                }
                
                Section(header: Text("Steps")) {
                    ForEach(item.steps.indices, id: \.self) { index in
                        VStack(alignment: .leading) {
                            let step = item.steps[index]
                            
                            Text("\(index + 1). \(step.stepTitle)")
                                .font(.headline)
                            
                            Text(step.stepDescription)
                            
                        }
                    }
                }
            }
            .scrollContentBackground(.hidden)
            .background(Color.clear)
            .navigationBarTitle(Text(item.name))
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                Button(action: {
                    isPresentingEditView = true
                    editingItem = item
                    tempImage = itemImage
                }) {
                    Text("Edit")
                }
            }
            .onAppear {
                itemImage = FileHelper.loadImage(fileName: item.image ?? "")
                tempImage = itemImage
            }
            .sheet(isPresented: $isPresentingEditView) {
                NavigationStack {
                    DetailEditView(item: $editingItem, itemImage: $tempImage)
                        .navigationTitle(item.name)
                        .toolbar {
                            ToolbarItem(placement: .cancellationAction) {
                                Button("Cancel") {
                                    isPresentingEditView = false
                                    tempImage = itemImage
                                }
                            }
                            ToolbarItem(placement: .confirmationAction) {
                                Button("Done") {
                                    isPresentingEditView = false
                                    item = editingItem
                                    
                                    itemImage = tempImage
                                    item.image = FileHelper.saveImage(image: tempImage)
                                    
                                }
                            }
                        }
                }
            }
        }
        
    }
}

#Preview {
    DetailView(item: .constant(DinnerItem.sampleItems[0]))
}
