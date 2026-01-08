import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    state: State = { hasError: false };

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        // Could log to external service here
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
                    <AlertTriangle className="w-16 h-16 text-destructive mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Coś poszło nie tak</h1>
                    <p className="text-muted-foreground mb-6 text-center max-w-md">
                        Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.
                    </p>
                    <Button onClick={this.handleReload} className="gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Odśwież stronę
                    </Button>
                </div>
            );
        }
        return this.props.children;
    }
}
