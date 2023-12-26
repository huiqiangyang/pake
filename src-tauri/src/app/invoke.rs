use std::fs::{self, File};
use std::io::Write;

use serde_json::Number;
use tauri::{api, AppHandle, command, Manager, Window};
use tauri::api::http::{ClientBuilder, HttpRequestBuilder, ResponseType};

use crate::util::{check_file_or_append, get_download_message, MessageType, show_toast};

#[derive(serde::Deserialize)]
pub struct DownloadFileParams {
    url: String,
    filename: String,
}

#[derive(serde::Deserialize)]
pub struct BinaryDownloadParams {
    filename: String,
    binary: Vec<u8>,
}

#[command]
pub async fn download_file(app: AppHandle, params: DownloadFileParams) -> Result<(), String> {
    let window: Window = app.get_window("pake").unwrap();
    show_toast(&window, &get_download_message(MessageType::Start));

    let output_path = api::path::download_dir().unwrap().join(params.filename);
    let file_path = check_file_or_append(output_path.to_str().unwrap());
    let client = ClientBuilder::new().build().unwrap();

    let response = client
        .send(
            HttpRequestBuilder::new("GET", &params.url)
                .unwrap()
                .response_type(ResponseType::Binary),
        )
        .await;

    match response {
        Ok(res) => {
            let bytes = res.bytes().await.unwrap().data;

            let mut file = File::create(file_path).unwrap();
            file.write_all(&bytes).unwrap();
            show_toast(&window, &get_download_message(MessageType::Success));
            Ok(())
        }
        Err(e) => {
            show_toast(&window, &get_download_message(MessageType::Failure));
            Err(e.to_string())
        }
    }
}

#[command]
pub async fn download_file_by_binary(
    app: AppHandle,
    params: BinaryDownloadParams,
) -> Result<(), String> {
    let window: Window = app.get_window("pake").unwrap();
    show_toast(&window, &get_download_message(MessageType::Start));
    let output_path = api::path::download_dir().unwrap().join(params.filename);
    let file_path = check_file_or_append(output_path.to_str().unwrap());
    let download_file_result = fs::write(file_path, &params.binary);
    match download_file_result {
        Ok(_) => {
            show_toast(&window, &get_download_message(MessageType::Success));
            Ok(())
        }
        Err(e) => {
            show_toast(&window, &get_download_message(MessageType::Failure));
            Err(e.to_string())
        }
    }
}

#[tauri::command]
pub async fn get_code(code: String, clientVersion: Number) -> String {
    let url = format!("http://107.172.190.71:8582/api/discord/token?code={}&clientVersion={}", code, clientVersion);
    let response = reqwest::get(url).await.unwrap();
    return response.text().await.unwrap();
}


#[tauri::command]
pub async fn get_html() -> String {
    let url = "http://107.172.190.71:8582/api/discord/html".to_string();
    let response = reqwest::get(url).await.unwrap();
    return response.text().await.unwrap();
}

#[tauri::command]
pub async fn get_version() -> String {
    let url = "http://107.172.190.71:8582/api/discord/version".to_string();
    let response = reqwest::get(url).await.unwrap();
    return response.text().await.unwrap();
}