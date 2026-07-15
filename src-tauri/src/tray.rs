use tauri::menu::{Menu, MenuItem};
use tauri::tray::TrayIconBuilder;
use tauri::{App, AppHandle, Emitter, Manager, PhysicalPosition};

use crate::state::AppState;

pub fn build_tray(app: &mut App) -> tauri::Result<()> {
    let show_companion = MenuItem::with_id(
        app,
        "toggle-companion",
        "Show/Hide Companion",
        true,
        None::<&str>,
    )?;
    let open_dashboard =
        MenuItem::with_id(app, "open-dashboard", "Open Dashboard", true, None::<&str>)?;
    let pause_learning = MenuItem::with_id(
        app,
        "toggle-learning",
        "Pause/Resume Learning",
        true,
        None::<&str>,
    )?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let menu = Menu::with_items(
        app,
        &[&show_companion, &open_dashboard, &pause_learning, &quit],
    )?;

    let mut builder = TrayIconBuilder::new()
        .tooltip("Bloom")
        .menu(&menu)
        .show_menu_on_left_click(true)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "toggle-companion" => toggle_companion(app),
            "open-dashboard" => show_dashboard(app),
            "toggle-learning" => toggle_learning(app),
            "quit" => app.exit(0),
            _ => {}
        });

    if let Some(icon) = app.default_window_icon() {
        builder = builder.icon(icon.clone());
    }

    builder.build(app)?;
    Ok(())
}

fn toggle_companion(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("companion") {
        match window.is_visible() {
            Ok(true) => {
                let _ = window.hide();
            }
            Ok(false) => {
                position_companion(app);
                let _ = window.show();
                let _ = window.set_focus();
            }
            Err(_) => {}
        }
    }
}

pub fn position_companion(app: &AppHandle) {
    const SAFE_INSET: u32 = 20;

    let Some(window) = app.get_webview_window("companion") else {
        return;
    };
    let Ok(Some(monitor)) = window.primary_monitor() else {
        return;
    };
    let Ok(window_size) = window.outer_size() else {
        return;
    };

    let work_area = monitor.work_area();
    let horizontal_offset = work_area
        .size
        .width
        .saturating_sub(window_size.width)
        .saturating_sub(SAFE_INSET);
    let vertical_offset = work_area
        .size
        .height
        .saturating_sub(window_size.height)
        .saturating_sub(SAFE_INSET);
    let x = work_area.position.x + i32::try_from(horizontal_offset).unwrap_or_default();
    let y = work_area.position.y + i32::try_from(vertical_offset).unwrap_or_default();

    let _ = window.set_position(PhysicalPosition::new(x, y));
}

fn show_dashboard(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("dashboard") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn toggle_learning(app: &AppHandle) {
    let state = app.state::<AppState>();
    let learning_state = state.toggle_learning_paused();
    let _ = app.emit("learning-state-changed", &learning_state);
}
