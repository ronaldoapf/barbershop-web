import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { queryClient } from '@/lib/query-client'
import { AppRouter } from './routes/app-router'
import { TooltipProvider } from './components/ui/tooltip'
import { ThemeProvider } from './contexts/theme-provider/theme-provider'
import { AuthProvider } from './contexts/auth-context/auth-provider'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey='vite-ui-theme'>
          <TooltipProvider>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
            <Toaster position='top-center' />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
