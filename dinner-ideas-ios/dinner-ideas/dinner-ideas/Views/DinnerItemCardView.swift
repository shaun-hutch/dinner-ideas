//
//  DinnerItemCardView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 30/01/2025.
//

import SwiftUI

struct DinnerItemCardView : View {
    let item: DinnerItem
    
    @State var image: UIImage?
    
    var body: some View {
        VStack {
            DinnerItemImageView(canEdit: false, imageGenerationConcept: .constant(""), selectedImage: $image)
            HStack {
                VStack {
                    HStack {
                        Text(item.name)
                            .font(.headline)
                        Spacer()
                    }.padding(5)
                    HStack {
                        ForEach (item.tags, id: \.self) { tag in
                            FoodTagView(tag: tag)
                        }
                    }
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(5)
                }
                Spacer()
                Text("\(item.totalTime) mins")
                    .padding(5)
                
            }
        }
        .onAppear {
            image = FileHelper.loadImage(fileName: item.image ?? "")
        }
        .onChange(of: item.image) { newImage, _ in
            image = FileHelper.loadImage(fileName: newImage ?? "")
        }
    }
}

#Preview {
    DinnerItemCardView(item: DinnerItem.sampleItems[0])
}
