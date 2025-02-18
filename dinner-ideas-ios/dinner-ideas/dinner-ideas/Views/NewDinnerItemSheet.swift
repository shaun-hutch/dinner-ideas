//
//  NewDinnerItemSheet.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 13/02/2025.
//

import SwiftUI

public struct NewDinnerItemSheet: View {
    @State private var newDinnerItem: DinnerItem = DinnerItem.emptyDinnerItem
    @Binding var items: [DinnerItem]
    @Binding var isPresentingSheet: Bool
    
    public var body: some View {
        NavigationStack {
            DetailEditView(item: $newDinnerItem)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Dismiss") {
                            isPresentingSheet = false
                            if newDinnerItem.image != nil {
                                FileHelper.deleteImage(fileName: newDinnerItem.image)
                            }
                        }
                    }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Add") {
                            items.append(newDinnerItem)
                            isPresentingSheet = false
                        }
                    }
                }
        }
    }
}

#Preview {
    NewDinnerItemSheet(items: .constant(DinnerItem.sampleItems), isPresentingSheet: .constant(true))
}
