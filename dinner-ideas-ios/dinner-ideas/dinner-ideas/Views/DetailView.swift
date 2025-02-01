//
//  DetailView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 01/02/2025.
//

import SwiftUI

struct DetailView: View {
    @Binding var item: DinnerItem
    
    @State private var editingItem = DinnerItem.emptyDinnerItem
    @State private var isPresentingEditView = false
    
    var body: some View {
        List {
            VStack {
                DinnerItemImageView(image: item.image)
                    .frame(maxWidth: .infinity, alignment: .center)
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
        .navigationBarTitle(Text(item.name))
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            Button(action: {
                isPresentingEditView = true
                editingItem = item
                
            }) {
                Image(systemName: "pencil")
            }
        }
        .sheet(isPresented: $isPresentingEditView) {
            NavigationStack {
                DetailEditView(item: $editingItem)
            }
        }
    }
}

#Preview {
    DetailView(item: .constant(DinnerItem.sampleItems[0]))
}
