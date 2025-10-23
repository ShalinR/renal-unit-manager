import React from "react";

type State = { hasError: boolean; error?: any };

export default class DevErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: any) { return { hasError: true, error }; }
  componentDidCatch(error: any, info: any) { console.error("[EB] Caught:", error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, margin: 16, border: "1px solid #f5c2c7", background: "#fff3f3"}}>
          <h3 style={{ marginTop: 0 }}>Render error</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>
{String(this.state.error)}
          </pre>
          <p style={{marginTop:8}}>Check the browser console for stack traces.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

