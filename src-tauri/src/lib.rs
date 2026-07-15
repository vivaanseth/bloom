pub mod actions;
pub mod commands;
pub mod models;
pub mod ollama;
pub mod platform;
pub mod prediction;
pub mod privacy;
pub mod storage;
pub mod suggestions;
pub mod terminal;

mod state;
mod tray;

use tauri::WindowEvent;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .manage(state::AppState::default())
        .setup(|app| {
            tray::build_tray(app)?;
            tray::position_companion(app.handle());
            Ok(())
        })
        .on_window_event(|window, event| {
            if window.label() == "dashboard" {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                    let _ = window.hide();
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            commands::get_platform_capabilities,
            commands::get_mock_suggestion,
            commands::respond_to_mock_suggestion,
            commands::list_mock_activity,
            commands::get_learning_state,
            commands::set_learning_paused,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
