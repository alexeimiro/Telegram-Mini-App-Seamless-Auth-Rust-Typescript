export const TELEGRAM_CONFIG = {
    botUsername: '@test_axumbot', // Replace with your bot's username
    apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000',
};

export const initTelegramApp = () => {
    // Initialize Telegram WebApp
    const webApp = window.Telegram.WebApp;
    
    // Enable closing confirmation
    webApp.enableClosingConfirmation();
    
    // Expand the WebApp to full height
    webApp.expand();
    
    // Set the header color
    webApp.setHeaderColor('#2481cc');
    
    // Set the background color
    webApp.setBackgroundColor('#ffffff');

    // Log initialization status
    console.log('Telegram WebApp initialized with version:', webApp.version);
    console.log('WebApp platform:', webApp.platform);
    console.log('WebApp colorScheme:', webApp.colorScheme);
    console.log('WebApp initData:', webApp.initData);
    
    return webApp;
}; 