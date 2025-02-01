//
//  DetailView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 01/02/2025.
//

import SwiftUI

struct DetailView: View {
    @Binding var item: DinnerItem
    
    var body: some View {
        List {
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
            
            .navigationBarTitle(item.name)
        }
    }
}

#Preview {
    DetailView(item: .constant(DinnerItem.sampleItems[0]))
}
