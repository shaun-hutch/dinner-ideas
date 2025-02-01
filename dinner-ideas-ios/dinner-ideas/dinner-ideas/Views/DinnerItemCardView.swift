//
//  DinnerItemCardView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 30/01/2025.
//

import SwiftUI

struct DinnerItemCardView : View {
    @State var item: DinnerItem
    
    var body: some View {
        VStack {
            if let image = (UIImage(named: item.image)) {
                Image(uiImage: image)
                    .scaledToFill()
                    .frame(width: 150, height: 150)
            } else {
                Image(systemName: "fork.knife.circle")
                    .font(.system(size: 150))
                    .scaledToFill()
            }
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
                    }.frame(maxWidth: .infinity, alignment: .leading)
                        .padding(5)
                }
                Spacer()
                Text("\(item.totalTime) mins")
                    .padding(5)
            }
        }
        
        
    }
}

#Preview {
    DinnerItemCardView(item: DinnerItem.sampleItems[0])
}
