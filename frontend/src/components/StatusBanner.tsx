interface StatusBannerProps {
  status: 'error' | 'info' | 'success';
  message: string;
  onDismiss?: () => void;
}

export function StatusBanner({ status, message, onDismiss }: StatusBannerProps) {
  const bannerProps =
    status === 'error'
      ? ({ role: 'alert' as const } )
      : ({ role: 'status' as const, 'aria-live': 'polite' as const });
  return (
    <div className={`status-banner status-banner--${status}`} {...bannerProps}>
      <span>{message}</span>
      {onDismiss ? (
        <button type="button" onClick={onDismiss} aria-label="Dismiss message">
          x
        </button>
      ) : null}
    </div>
  );
}
