import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { initTelegramApp, TELEGRAM_CONFIG } from './config/telegram'
import './index.css'
import './App.css'
import axios from 'axios'

function App() {
  const [webApp, setWebApp] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Initialize Telegram WebApp
        const app = initTelegramApp()
        setWebApp(app)
        
        console.log('WebApp initialized:', app)
        console.log('Init Data:', app.initData)
        console.log('Init Data Unsafe:', app.initDataUnsafe)

        // Get user data and init data
        if (app.initDataUnsafe.user) {
          setUser(app.initDataUnsafe.user)
          console.log('User data:', app.initDataUnsafe.user)
          
          // Get init data directly from WebApp
          const initData = app.initData
          if (!initData) {
            throw new Error('No init data available')
          }

          // Log the init data for debugging
          setDebugInfo(`Init Data: ${initData}`)

          console.log('Sending init data to backend:', initData)
          console.log('API URL:', `${TELEGRAM_CONFIG.apiUrl}/api/auth/verify`)

          // Send the raw init data string to the backend
          const response = await axios.get(`${TELEGRAM_CONFIG.apiUrl}/api/auth/verify`, {
            params: {
              init_data: initData
            },
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded'
            }
          })

          console.log('Backend response:', response)

          if (response.status === 200) {
            console.log('User verified and saved successfully')
          } else {
            throw new Error('Failed to verify user')
          }
        } else {
          throw new Error('No user data available')
        }

        // Notify Telegram that the app is ready
        app.ready()
      } catch (err: any) {
        console.error('Error initializing app:', err)
        console.error('Error details:', err.response?.data)
        setError(err.response?.data?.message || err.message || 'An error occurred')
      }
    }

    initializeApp()
  }, [])

  if (error) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Error</h1>
          <p>{error}</p>
          {debugInfo && (
            <div className="debug-info">
              <h3>Debug Information:</h3>
              <pre>{debugInfo}</pre>
            </div>
          )}
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry
          </button>
        </header>
      </div>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Telegram Mini App</h1>
        {user && (
          <div className="user-info">
            <p>Welcome, {user.first_name}!</p>
            {user.username && <p>Username: @{user.username}</p>}
          </div>
        )}
        {debugInfo && (
          <div className="debug-info">
            <h3>Debug Information:</h3>
            <pre>{debugInfo}</pre>
          </div>
        )}
      </header>
      <main>
        {/* Add your app content here */}
      </main>
    </div>
  )
}

export default App
