pub mod auth;
pub mod users;

use axum::{
    extract::State,
    Json,
    response::IntoResponse,
    http::StatusCode,
};
use sqlx::PgPool;
use crate::models::User;

pub async fn list_users(
    State(pool): State<PgPool>,
) -> impl IntoResponse {
    match sqlx::query_as::<_, User>("SELECT * FROM users ORDER BY created_at DESC")
        .fetch_all(&pool)
        .await
    {
        Ok(users) => Json(users).into_response(),
        Err(_) => StatusCode::INTERNAL_SERVER_ERROR.into_response(),
    }
} 