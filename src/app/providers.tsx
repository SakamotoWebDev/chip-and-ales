import { ReactNode } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ErrorBoundary } from 'react-error-boundary'
import { StoreProvider } from '../store/createStore'

interface ProvidersProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ProvidersProps) {
  return (
    <ErrorBoundary fallback={<div>Something went wrong.</div>}>
      <StoreProvider>
        <NextThemesProvider attribute="class" defaultTheme="light">
          {children}
        </NextThemesProvider>
      </StoreProvider>
    </ErrorBoundary>
  )
}