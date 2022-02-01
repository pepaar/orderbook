import React from "react";
import styles from "./ErrorBoundary.module.css";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // TODO: Log error
  }

  public render() {
    if (this.state.hasError) {
      return <div className={styles.container}>Something went wrong :( Please refresh the page.</div>;
    }

    return this.props.children;
  }
}
