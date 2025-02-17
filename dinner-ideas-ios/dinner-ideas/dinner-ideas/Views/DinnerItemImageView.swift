//
//  DinnerItemImageView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 01/02/2025.
//

import SwiftUI
import PhotosUI
import AVFoundation

struct DinnerItemImageView: View {
    let canEdit: Bool
    @Binding var fileName: String?
    
    @State var selectedItem: PhotosPickerItem? = nil
    @State var selectedImage: UIImage? = nil
    
    @State var isShowingCamera: Bool = false
    @State var isShowingPicker: Bool = false
    
    @State private var isShowingPermissionAlert = false
    
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
        .onAppear {
            loadImage()
        }
        .onChange(of: fileName) {
            loadImage()
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
            
            } label: {
                Text("Select")
            }

            // sheet to show camera
            .sheet(isPresented: $isShowingCamera) {
                ImagePicker(sourceType: .camera, selectedImage: $selectedImage, fileName: $fileName)
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
                    saveImageToAppStorage(image: selectedImage)
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

    
    private func saveImageToAppStorage(image: UIImage?) {
        guard let data = image?.jpegData(compressionQuality: 0.8) else { return }

        fileName = UUID().uuidString + ".jpg" // Unique file name
        let fileURL = getDocumentsDirectory().appendingPathComponent(fileName ?? "")

        do {
            try data.write(to: fileURL)
            print("saving file: \(fileURL.path)")
        } catch {
            print("Error saving image: \(error)")
        }
    }
    
    func loadImage() {
        let fileURL = getDocumentsDirectory().appendingPathComponent(fileName ?? "")
        print("loading file: \(fileURL.path)")

        if let data = try? Data(contentsOf: fileURL), let image = UIImage(data: data) {
            selectedImage = image
        }
    }
    
    private func getDocumentsDirectory() -> URL {
        FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
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
    DinnerItemImageView(canEdit: true, fileName: .constant(""))
}
