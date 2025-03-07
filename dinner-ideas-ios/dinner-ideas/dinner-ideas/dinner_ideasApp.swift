//
//  dinner_ideasApp.swift
//  dinner-ideas
//
//  Created by Shaun Hutchinson on 28/01/2025.
//

import SwiftUI

@main
struct dinner_ideasApp: App {
    
    @StateObject private var store = DinnerItemStore()
    
    var body: some Scene {
        WindowGroup {
            TabView {
                Tab("Dinner Items", systemImage: "fork.knife.circle") {
                    DinnerItemsView(dinnerItems: $store.items) {
                        Task {
                            do {
                                try await store.save(items: store.items)
                            } catch {
                                print("error saving items")
                            }
                        }
                    }
                }
                Tab("Generate", systemImage: "note.text.badge.plus") {
                    GenerateView(dinnerItems: store.items)
                }
                Tab("History", systemImage: "clock") {
                    Text("History")
                }
            }
            .task {
                do {
                    try await store.load()
                } catch {
                    print("error!")
                }
            }
        }
    }
}
    
