import { Component, type ErrorInfo, type ReactNode } from 'react'

interface CanvasBoundaryProps {
  label: string
  fallback: ReactNode
  children: ReactNode
}

interface CanvasBoundaryState {
  failed: boolean
}

/** Keeps a WebGL failure (blocked GPU, lost context) from taking the whole page down with it. */
export class CanvasBoundary extends Component<CanvasBoundaryProps, CanvasBoundaryState> {
  state: CanvasBoundaryState = { failed: false }

  static getDerivedStateFromError(): CanvasBoundaryState {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(`${this.props.label} could not render, showing its fallback instead.`, error, info.componentStack)
  }

  render(): ReactNode {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
