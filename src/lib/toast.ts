type ToastType = 'success' | 'error' | 'info'

function dispatchToast(message: string, type: ToastType) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('devlog-toast', { detail: { message, type } }))
  }
}

export const toast = {
  success: (msg: string) => dispatchToast(msg, 'success'),
  error: (msg: string) => dispatchToast(msg, 'error'),
  info: (msg: string) => dispatchToast(msg, 'info'),
}
