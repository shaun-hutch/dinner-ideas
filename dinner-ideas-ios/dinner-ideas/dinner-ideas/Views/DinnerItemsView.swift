//
//  DinnerItemsView.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 28/01/2025.
//

import SwiftUI

struct DinnerItemsView: View {
    @Binding var dinnerItems: [DinnerItem]
    @Environment(\.scenePhase) private var scenePhase
    
    @State private var isPresentingNewDinnerItemView = false
    
    @State private var showAlert: Bool = false
    @State private var deleting: Bool = false
    @State private var itemToDelete: DinnerItem? = nil
    
    let saveAction: () -> Void
    
    var body: some View {
        NavigationStack {
            List($dinnerItems, id: \.id) { $dinnerItem in
                NavigationLink(destination: DetailView(item: $dinnerItem)) {
                    DinnerItemCardView(item: dinnerItem)
                }
                .swipeActions {
                    Button("Delete") {
                        promptDeleteItem(item: dinnerItem)
                    }
                    .tint(.red)
                }
            }
            .alert(isPresented: $showAlert) {
                Alert(
                    title: Text("Delete Item"),
                    message: Text("Are you sure you want to delete \(itemToDelete?.name ?? "")?"),
                    primaryButton: .destructive(Text("Delete")) {
                        if let itemToDelete = itemToDelete {
                            deleteItem(item: itemToDelete)
                        }
                    },
                    secondaryButton: .cancel()
                )
            }
            
            .navigationTitle("Dinner Ideas")
            .navigationBarTitleDisplayMode(.large)
        }
        .sheet(isPresented: $isPresentingNewDinnerItemView) {
            Text("New Item")
        }
        .onChange(of: scenePhase) { _, newPhase in
            if newPhase == .inactive {
                saveAction()
            }
        }
    }
    
    private func promptDeleteItem(item: DinnerItem) {
        if !deleting {
            itemToDelete = item
            showAlert = true  // Show the confirmation alert
        }
    }
        
    private func deleteItem(item: DinnerItem) {
        if let index = dinnerItems.firstIndex(where: { $0.id == item.id }) {
            withAnimation {
                _ = dinnerItems.remove(at: index)
            }
        }
    }
}

#Preview {
    DinnerItemsView(dinnerItems: .constant(DinnerItem.sampleItems), saveAction: {})
}
