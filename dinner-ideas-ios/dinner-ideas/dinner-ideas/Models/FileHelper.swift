//
//  Constants.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 15/02/2025.
//

import SwiftUI

struct FileHelper {
    static let documentsUrl = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
    
    static func getFileUrl(fileName: String) -> URL {
        return self.documentsUrl.appendingPathComponent(fileName)
    }
    
    static func saveImage(image: UIImage) -> String {
        guard let data = image.jpegData(compressionQuality: 0.8) else { return "" }
        
        let fileName = UUID().uuidString + ".jpg"
        let fileURL = getFileUrl(fileName: fileName)

        do {
            try data.write(to: fileURL)
            return fileURL.path
        } catch {
            print("Error saving image: \(error)")
            return ""
        }
    }
    
    static func deleteImage(fileName: String?) {
        guard let fileName else { return }
        
        let fileURL = getFileUrl(fileName: fileName)
        do {
            print("Delete image \(fileURL.path)")
            try FileManager.default.removeItem(at: fileURL)
        } catch {
            print("Error deleting image: \(error)")
        }
    }
}
