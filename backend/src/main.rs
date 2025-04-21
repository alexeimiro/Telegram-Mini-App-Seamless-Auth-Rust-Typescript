mod auth;
mod models;
mod db;
mod routes;

use axum::{
    routing::get,
    Router,
};
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};
use std::net::SocketAddr;
use http::header;
use http::Method;
use tower_http::cors::AllowOrigin;
use http::HeaderValue;

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(EnvFilter::new(
            std::env::var("RUST_LOG").unwrap_or_else(|_| "info".into()),
        ))
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load environment variables
    dotenv::dotenv().ok();

    // Initialize database connection
    let pool = db::init_db().await.expect("Failed to initialize database");
    
    // Initialize database schema
    db::init_schema(&pool)
        .await
        .expect("Failed to initialize database schema");

    // Create CORS layer with specific configuration
    let cors = CorsLayer::new()
        .allow_origin(AllowOrigin::exact(HeaderValue::from_static("https://customer-support-app.loca.lt")))
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
        .allow_headers([
            header::CONTENT_TYPE,
            header::ACCEPT,
            header::AUTHORIZATION,
        ])
        .allow_credentials(true);

    // Create router
    let app = Router::new()
        .route("/api/auth/verify", get(routes::auth::handle_verify_init_data))
        .route("/api/users", get(routes::users::list_users))
        .layer(cors)
        .with_state(pool);

    // Start server
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    tracing::info!("listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
