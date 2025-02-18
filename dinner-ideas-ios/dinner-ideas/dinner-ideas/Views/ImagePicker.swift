//
//  ImagePicker.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 17/02/2025.
//

import SwiftUI
import UIKit

// Picker to implement showing the camera, based on the UIImagePickerController
struct ImagePicker : UIViewControllerRepresentable {
    var sourceType: UIImagePickerController.SourceType
    
    @Binding var selectedImage: UIImage?
    @Binding var fileName: String?
    
    @Environment(\.presentationMode) private var presentationMode
    
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }
    
    // setup code to show the view controller
    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = sourceType
        picker.delegate = context.coordinator
        return picker
    }
    
    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}
    
    class Coordinator: NSObject, UINavigationControllerDelegate, UIImagePickerControllerDelegate {
        let parent: ImagePicker
        
        init(_ parent: ImagePicker) {
            self.parent = parent
        }

        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey: Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.selectedImage = image
                
                
                print("fileName: \(parent.fileName ?? "")")
                if parent.fileName == nil || parent.fileName!.isEmpty {
                    parent.fileName = UUID().uuidString + ".jpg"
                }
                
                // Save to storage
                parent.saveImageToAppStorage(image: image)
            }
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
    
    private func saveImageToAppStorage(image: UIImage?) {
        guard let data = image?.jpegData(compressionQuality: 0.8) else { return }

        let fileURL = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
            .first!
            .appendingPathComponent(fileName ?? "")
        
        print(fileURL.path)

        do {
            try data.write(to: fileURL, options: .atomic)
            print("saving file from camera: \(fileURL.path)")
        } catch {
            print("Error saving image: \(error)")
        }
    }
}
