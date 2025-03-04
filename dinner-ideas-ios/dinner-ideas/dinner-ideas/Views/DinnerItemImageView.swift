//
//  DinnerItemImageView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 01/02/2025.
//

import SwiftUI
import PhotosUI
import AVFoundation
import ImagePlayground

struct DinnerItemImageView: View {
    let canEdit: Bool
    @Binding var imageGenerationConcept: String
    @Binding var selectedImage: UIImage?
    
    @State var selectedItem: PhotosPickerItem? = nil
    
    @State var isShowingCamera: Bool = false
    @State var isShowingPicker: Bool = false
    @State var isShowingImagePlayground: Bool = false
    
    @State private var isShowingPermissionAlert = false
    
    @Environment(\.supportsImagePlayground) var supportsImagePlayground
    
    var body: some View {
        VStack {
            if let image = selectedImage {
                Image(uiImage: image)
                    .resizable()
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
        if canEdit {
            Menu {
                Button(action: {
                    Task {
                        await checkCameraPermission()
                    }
                }) {
                    HStack {
                        Image(systemName: "camera")
                        Text("Take a Photo")
                    }
                }
                Button(action: {
                    isShowingPicker = true
                }) {
                    HStack {
                        Image(systemName: "photo.on.rectangle")
                        Text("Choose from Library")
                    }
                }
                if supportsImagePlayground {
                    Button(action: {
                        isShowingImagePlayground = true
                    }) {
                        HStack {
                            Image(systemName: "apple.image.playground")
                            Text("Generate from Playground")
                        }
                    }
                }

            
            } label: {
                Text("Select")
            }

            // sheet to show camera
            .sheet(isPresented: $isShowingCamera) {
                ImagePicker(sourceType: .camera, selectedImage: $selectedImage)
            }
            
            // alert to show if camera permission is denied
            .alert("Camera Permission Denied", isPresented: $isShowingPermissionAlert) {
                Button("OK", role: .cancel) { }
            } message: {
                Text("Please enable camera access in Settings.")
            }
            
            // picker to show photos
            .photosPicker(isPresented: $isShowingPicker, selection: $selectedItem, matching: .images, preferredItemEncoding: .automatic)
            .task(id: selectedItem) {
                if let data = try? await selectedItem?.loadTransferable(type: Data.self),
                    let uiImage = UIImage(data: data) {
                        selectedImage = uiImage
                }
            }
            
            // image playground sheet
            .imagePlaygroundSheet(isPresented: $isShowingImagePlayground, concept: imageGenerationConcept) { url in
                if let data = try? Data(contentsOf: url) {
                    if let uiImage = UIImage(data: data) {
                        selectedImage = uiImage
                    }
                }
            }
        }
    }
    
    // wait for permission to be allowed
    private func checkCameraPermission() async {
        guard await isAuthorized else {
            isShowingPermissionAlert = true
            return
        }
        
        isShowingCamera = true
    }
    
    // permissions check
    var isAuthorized: Bool {
        get async {
            let status = AVCaptureDevice.authorizationStatus(for: .video)
            
            // Determine if the user previously authorized camera access.
            var isAuthorized = status == .authorized
            
            // If the system hasn't determined the user's authorization status,
            // explicitly prompt them for approval.
            if status == .notDetermined {
                isAuthorized = await AVCaptureDevice.requestAccess(for: .video)
            }
            
            return isAuthorized
        }
    }
}

#Preview {
    DinnerItemImageView(canEdit: true, imageGenerationConcept: .constant("Chicken Salad"), selectedImage: .constant(UIImage(systemName: "person.circle")!))
}
