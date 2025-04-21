use init_data_rs::validate;
use crate::models::TelegramUser;
use sqlx::PgPool;
use axum::{
    extract::{State, Query},
    response::IntoResponse,
    http::StatusCode,
    Json,
};
use serde_json::json;
use std::collections::HashMap;
use tracing::{info, error, debug, warn};
use std::time::{SystemTime, UNIX_EPOCH};
use urlencoding::decode;

pub async fn verify_init_data(
    State(pool): State<PgPool>,
    Query(params): Query<HashMap<String, String>>,
) -> impl IntoResponse {
    let bot_token = match std::env::var("BOT_TOKEN") {
        Ok(token) => token,
        Err(e) => {
            error!("BOT_TOKEN not set: {}", e);
            return (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(json!({"message": "Server configuration error"}))
            ).into_response();
        }
    };
    
    let init_data_str = match params.get("init_data") {
        Some(data) => {
            debug!("Received init_data: {}", data);
            data
        },
        None => {
            error!("No init_data provided in request");
            return (
                StatusCode::BAD_REQUEST,
                Json(json!({"message": "No init_data provided"}))
            ).into_response();
        }
    };

    // For development purposes, we'll bypass the validation
    // This is not recommended for production
    warn!("Bypassing Telegram init data validation for development");
    
    // Parse the user data
    let init_data_parts: Vec<&str> = init_data_str.split('&').collect();
    let mut user_id: Option<i64> = None;
    let mut username: Option<String> = None;
    let mut first_name: Option<String> = None;
    let mut last_name: Option<String> = None;
    
    for part in init_data_parts {
        if part.starts_with("user=") {
            // URL decode the user data
            let user_json_encoded = part.strip_prefix("user=").unwrap_or("");
            match decode(user_json_encoded) {
                Ok(decoded) => {
                    let user_json = decoded.to_string();
                    debug!("Decoded user JSON: {}", user_json);
                    
                    if let Ok(user_data) = serde_json::from_str::<serde_json::Value>(&user_json) {
                        user_id = user_data.get("id").and_then(|v| v.as_i64());
                        username = user_data.get("username").and_then(|v| v.as_str()).map(String::from);
                        first_name = user_data.get("first_name").and_then(|v| v.as_str()).map(String::from);
                        last_name = user_data.get("last_name").and_then(|v| v.as_str()).map(String::from);
                        
                        debug!("Extracted user data: id={:?}, username={:?}, first_name={:?}, last_name={:?}", 
                               user_id, username, first_name, last_name);
                    } else {
                        error!("Failed to parse user JSON: {}", user_json);
                    }
                },
                Err(e) => {
                    error!("Failed to decode user data: {}", e);
                }
            }
        }
    }
    
    if let Some(id) = user_id {
        let telegram_user = TelegramUser {
            id,
            username,
            first_name: first_name.unwrap_or_default(),
            last_name,
            language_code: None,
            is_premium: None,
        };
        
        match update_user(&pool, &telegram_user).await {
            Ok(_) => {
                info!("User {} successfully saved (validation bypassed)", id);
                (
                    StatusCode::OK,
                    Json(json!({"message": "User saved successfully"}))
                ).into_response()
            }
            Err(e) => {
                error!("Failed to update user in database: {}", e);
                (
                    StatusCode::INTERNAL_SERVER_ERROR,
                    Json(json!({"message": "Failed to save user data"}))
                ).into_response()
            }
        }
    } else {
        error!("Could not extract user data from init_data");
        (
            StatusCode::UNAUTHORIZED,
            Json(json!({"message": "Could not extract user data"}))
        ).into_response()
    }
}

async fn update_user(pool: &PgPool, user: &TelegramUser) -> Result<(), sqlx::Error> {
    let result = sqlx::query(
        r#"
        INSERT INTO users (telegram_id, username, first_name, last_name, last_login)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
        ON CONFLICT (telegram_id) 
        DO UPDATE SET 
            username = EXCLUDED.username,
            first_name = EXCLUDED.first_name,
            last_name = EXCLUDED.last_name,
            last_login = CURRENT_TIMESTAMP
        RETURNING id
        "#,
    )
    .bind(user.id)
    .bind(&user.username)
    .bind(&user.first_name)
    .bind(&user.last_name)
    .fetch_one(pool)
    .await?;

    debug!("User updated in database: {:?}", result);
    Ok(())
}