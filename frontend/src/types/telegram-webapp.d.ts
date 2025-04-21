interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        query_id: string;
        user: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
        };
        auth_date: number;
        hash: string;
    };
    version: string;
    platform: string;
    colorScheme: string;
    themeParams: {
        bg_color: string;
        text_color: string;
        hint_color: string;
        link_color: string;
        button_color: string;
        button_text_color: string;
        secondary_bg_color: string;
    };
    isExpanded: boolean;
    viewportHeight: number;
    viewportStableHeight: number;
    headerColor: string;
    backgroundColor: string;
    isClosingConfirmationEnabled: boolean;
    BackButton: {
        isVisible: boolean;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
        show: () => void;
        hide: () => void;
    };
    MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        isProgressVisible: boolean;
        setText: (text: string) => void;
        onClick: (callback: () => void) => void;
        offClick: (callback: () => void) => void;
        show: () => void;
        hide: () => void;
        enable: () => void;
        disable: () => void;
        showProgress: (leaveActive: boolean) => void;
        hideProgress: () => void;
        setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
        }) => void;
    };
    HapticFeedback: {
        impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
        notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
        selectionChanged: () => void;
    };
    close: () => void;
    expand: () => void;
    enableClosingConfirmation: () => void;
    disableClosingConfirmation: () => void;
    setHeaderColor: (color: string) => void;
    setBackgroundColor: (color: string) => void;
    ready: () => void;
    sendData: (data: string) => void;
    openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
    openTelegramLink: (url: string) => void;
    showPopup: (params: {
        title?: string;
        message: string;
        buttons?: Array<{
            id: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
        }>;
    }, callback?: (buttonId: string) => void) => void;
    showAlert: (message: string, callback?: () => void) => void;
    showConfirm: (message: string, callback?: (isConfirmed: boolean) => void) => void;
    showScanQRPopup: (params: {
        text?: string;
    }, callback?: (text: string) => void) => void;
    closeScanQRPopup: () => void;
    readTextFromClipboard: (callback?: (text: string) => void) => void;
    requestWriteAccess: (callback?: (isGranted: boolean) => void) => void;
    requestContact: (callback?: (isGranted: boolean) => void) => void;
}

interface Window {
    Telegram: {
        WebApp: TelegramWebApp;
    };
} 