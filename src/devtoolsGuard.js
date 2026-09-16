const blockedShortcuts = (event) => {
  const key = event.key.toLowerCase()
  const command = event.ctrlKey || event.metaKey
  const inspectShortcut =
    event.key === 'F12' ||
    (command && event.shiftKey && ['i', 'j', 'c'].includes(key)) ||
    (event.metaKey && event.altKey && ['i', 'j', 'c'].includes(key)) ||
    (command && key === 'u')

  if (!inspectShortcut) return

  event.preventDefault()
  event.stopImmediatePropagation()
}

const blockContextMenu = (event) => {
  event.preventDefault()
}

export function enableDevtoolsGuard() {
  if (!import.meta.env.PROD) return

  window.addEventListener('keydown', blockedShortcuts, { capture: true })
  window.addEventListener('contextmenu', blockContextMenu, { capture: true })
}
