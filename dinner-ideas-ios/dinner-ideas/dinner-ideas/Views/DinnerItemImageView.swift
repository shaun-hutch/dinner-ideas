//
//  DinnerItemImageView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 01/02/2025.
//

import SwiftUI

struct DinnerItemImageView: View {
    let image: String
    
    var body: some View {
        if let image = (UIImage(named: image)) {
            Image(uiImage: image)
                .scaledToFill()
                .frame(width: 150, height: 150)
                .cornerRadius(20)
        } else {
            Image(systemName: "fork.knife.circle")
                .font(.system(size: 150))
                .scaledToFill()
                .cornerRadius(20)
            
        }
    }
}

#Preview {
    DinnerItemImageView(image: "")
}
