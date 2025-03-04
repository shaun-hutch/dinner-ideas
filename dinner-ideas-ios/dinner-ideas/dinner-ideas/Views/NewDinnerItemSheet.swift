//
//  NewDinnerItemSheet.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 13/02/2025.
//

import SwiftUI

public struct NewDinnerItemSheet: View {
    @State private var newDinnerItem: DinnerItem = DinnerItem.emptyDinnerItem
    @State private var itemImage: UIImage?
    @Binding var items: [DinnerItem]
    @Binding var isPresentingSheet: Bool
    
    public var body: some View {
        NavigationStack {
            DetailEditView(item: $newDinnerItem, itemImage: $itemImage)
                .toolbar {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Dismiss") {
                            isPresentingSheet = false
                        }
                    }
                    ToolbarItem(placement: .confirmationAction) {
                        Button("Add") {
                            newDinnerItem.image = FileHelper.saveImage(image: itemImage)
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
