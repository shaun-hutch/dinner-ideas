//
//  TagPicker.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 02/02/2025.
//

import SwiftUI

struct TagPicker: View {
    @Binding var selectedTags: [FoodTag]
    
    @Environment(\.dismiss) private var dismiss
    
    var body: some View {
        NavigationView {
            List {
                ForEach(FoodTag.allCases, id: \.self.id) { tag in
                    HStack {
                        FoodTagView(tag: tag)
                        Spacer()
                        if (selectedTags.contains(tag)) {
                            Image(systemName: "checkmark")
                        }
                    }
                    .padding(5)
                    .contentShape(Rectangle())
                    .onTapGesture {
                        if (selectedTags.contains(tag)) {
                            selectedTags.remove(at: selectedTags.firstIndex(of: tag)!)
                        } else {
                            selectedTags.append(tag)
                        }
                    }
                }
            }
            .navigationTitle("Select Tags")
            .toolbar {
                Button(action: {
                    dismiss()
                }) {
                    Text("Close")
                }
            }
            
        }
        
    }
}

#Preview {
    TagPicker(selectedTags: .constant([FoodTag.Cheap, FoodTag.Vegeterian]))
}
