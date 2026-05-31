import { invoke } from '@tauri-apps/api/core'

export const isTauri = () => typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window

export function safeFileName(filename: string, fallback = 'kairnly-export') {
  const cleaned = filename
    .trim()
    .split('')
    .filter((char) => char.charCodeAt(0) >= 32)
    .join('')
    .replace(/[<>:"/\\|?*]/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/^\.+$/, '')
    .replace(/^-+|-+$/g, '')

  return cleaned || fallback
}

async function blobToBytes(blob: Blob) {
  return Array.from(new Uint8Array(await blob.arrayBuffer()))
}

export async function downloadBlob(blob: Blob, filename: string) {
  const safeName = safeFileName(filename)

  if (isTauri()) {
    return invoke<string>('save_file_to_downloads', {
      filename: safeName,
      data: await blobToBytes(blob),
    })
  }

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = safeName
  anchor.rel = 'noopener'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function downloadText(filename: string, content: string, type: string) {
  return downloadBlob(new Blob([content], { type }), filename)
}
