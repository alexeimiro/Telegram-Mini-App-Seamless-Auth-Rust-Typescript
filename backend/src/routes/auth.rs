use axum::{
    extract::{State, Query},
    response::IntoResponse,
};
use sqlx::PgPool;
use std::collections::HashMap;
use crate::auth::verify_init_data;

pub async fn handle_verify_init_data(
    State(pool): State<PgPool>,
    Query(params): Query<HashMap<String, String>>,
) -> impl IntoResponse {
    verify_init_data(State(pool), Query(params)).await
} 