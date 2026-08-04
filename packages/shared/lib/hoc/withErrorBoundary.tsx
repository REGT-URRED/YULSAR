import type { ComponentType, ErrorInfo, ReactElement } from 'react';
import { Component } from 'react';

class ErrorBoundary extends Component<
  {
    children: ReactElement;
    fallback: ReactElement;
  },
  {
    hasError: boolean;
    errorMessage: string;
  }
> {
  state = { hasError: false, errorMessage: '' };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // ponytail: show the real error so issues are diagnosable without the console
      return (
        <>
          {this.props.fallback}
          <pre
            style={{
              margin: '8px',
              padding: '8px',
              fontSize: '12px',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
              background: 'rgba(159, 6, 11, 0.1)',
              color: 'inherit',
              borderRadius: '4px',
            }}>
            {this.state.errorMessage || 'Unknown error (check console)'}
          </pre>
        </>
      );
    }

    return this.props.children;
  }
}

export function withErrorBoundary<T extends Record<string, unknown>>(
  Component: ComponentType<T>,
  ErrorComponent: ReactElement,
) {
  return function WithErrorBoundary(props: T) {
    return (
      <ErrorBoundary fallback={ErrorComponent}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}
