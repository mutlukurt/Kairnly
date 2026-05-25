import type { Page, TiptapDoc, TiptapNode } from '../../types'
import { db } from '../db/client'

const pageStyle = `
  .kairnly-pdf-page {
    width: 794px;
    min-height: 1123px;
    padding: 72px;
    background: #fffdf8;
    color: #1f1f1c;
    font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    line-height: 1.7;
    font-size: 15px;
  }
  .kairnly-pdf-title {
    margin: 0 0 28px;
    font-size: 38px;
    line-height: 1.15;
    letter-spacing: 0;
  }
  .kairnly-pdf-meta {
    margin-bottom: 18px;
    color: #8a8275;
    font-size: 12px;
  }
  .kairnly-pdf-page h1 { margin: 28px 0 10px; font-size: 28px; line-height: 1.2; }
  .kairnly-pdf-page h2 { margin: 24px 0 8px; font-size: 22px; line-height: 1.25; }
  .kairnly-pdf-page h3 { margin: 20px 0 6px; font-size: 18px; line-height: 1.3; }
  .kairnly-pdf-page p { margin: 9px 0; }
  .kairnly-pdf-page ul, .kairnly-pdf-page ol { margin: 10px 0; padding-left: 26px; }
  .kairnly-pdf-page li { margin: 4px 0; }
  .kairnly-pdf-page blockquote {
    margin: 16px 0;
    padding: 12px 16px;
    border-left: 4px solid #8b6f47;
    border-radius: 0 10px 10px 0;
    background: #f0ebe2;
  }
  .kairnly-pdf-page pre {
    margin: 16px 0;
    padding: 14px;
    border: 1px solid #e2dace;
    border-radius: 10px;
    overflow: hidden;
    background: #f0ebe2;
    white-space: pre-wrap;
    font-size: 12px;
    line-height: 1.55;
  }
  .kairnly-pdf-page code {
    padding: 2px 5px;
    border-radius: 5px;
    background: #f0ebe2;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }
  .kairnly-pdf-page pre code { padding: 0; background: transparent; }
  .kairnly-pdf-page hr { margin: 26px 0; border: 0; border-top: 1px solid #e2dace; }
  .kairnly-pdf-page img {
    display: block;
    max-width: 100%;
    max-height: 620px;
    margin: 16px 0;
    border-radius: 12px;
    border: 1px solid #e2dace;
  }
  .kairnly-pdf-page table { width: 100%; border-collapse: collapse; margin: 16px 0; }
  .kairnly-pdf-page td, .kairnly-pdf-page th { border: 1px solid #e2dace; padding: 8px; vertical-align: top; }
  .kairnly-pdf-page th { background: #f0ebe2; }
  .kairnly-pdf-media {
    margin: 16px 0;
    padding: 14px;
    border: 1px solid #e2dace;
    border-radius: 12px;
    background: #ffffff;
  }
  .kairnly-pdf-media small { display: block; color: #8a8275; margin-bottom: 5px; }
  .kairnly-pdf-media strong { display: block; }
  .kairnly-pdf-media span { display: block; overflow-wrap: anywhere; color: #6f6a60; font-size: 12px; }
`

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;')
}

function attrsToStyle(attrs?: Record<string, unknown>) {
  const styles: string[] = []
  if (typeof attrs?.color === 'string') styles.push(`color:${attrs.color}`)
  if (typeof attrs?.backgroundColor === 'string') styles.push(`background-color:${attrs.backgroundColor}`)
  return styles.length ? ` style="${styles.join(';')}"` : ''
}

function renderChildren(node?: TiptapNode) {
  return node?.content?.map(renderNode).join('') ?? ''
}

function renderText(node: TiptapNode) {
  let html = escapeHtml(node.text ?? '')
  node.marks?.forEach((mark) => {
    if (mark.type === 'bold') html = `<strong>${html}</strong>`
    if (mark.type === 'italic') html = `<em>${html}</em>`
    if (mark.type === 'underline') html = `<u>${html}</u>`
    if (mark.type === 'strike') html = `<s>${html}</s>`
    if (mark.type === 'code') html = `<code>${html}</code>`
    if (mark.type === 'link') html = `<a href="${escapeHtml(String(mark.attrs?.href ?? '#'))}">${html}</a>`
    if (mark.type === 'textStyle') html = `<span${attrsToStyle(mark.attrs)}>${html}</span>`
    if (mark.type === 'highlight') html = `<mark style="background:${escapeHtml(String(mark.attrs?.color ?? '#d8c6a5'))}">${html}</mark>`
  })
  return html
}

function renderNode(node: TiptapNode): string {
  if (node.type === 'text') return renderText(node)
  if (node.type === 'paragraph') return `<p>${renderChildren(node) || '&nbsp;'}</p>`
  if (node.type === 'heading') {
    const level = Number(node.attrs?.level ?? 1)
    const tag = level === 2 ? 'h2' : level === 3 ? 'h3' : 'h1'
    return `<${tag}>${renderChildren(node)}</${tag}>`
  }
  if (node.type === 'bulletList') return `<ul>${renderChildren(node)}</ul>`
  if (node.type === 'orderedList') return `<ol>${renderChildren(node)}</ol>`
  if (node.type === 'listItem') return `<li>${renderChildren(node)}</li>`
  if (node.type === 'taskList') return `<ul>${renderChildren(node)}</ul>`
  if (node.type === 'taskItem') {
    const checked = node.attrs?.checked ? '☑' : '☐'
    return `<li>${checked} ${renderChildren(node)}</li>`
  }
  if (node.type === 'blockquote') return `<blockquote>${renderChildren(node)}</blockquote>`
  if (node.type === 'codeBlock') return `<pre><code>${escapeHtml(node.content?.map((child) => child.text ?? '').join('') ?? '')}</code></pre>`
  if (node.type === 'horizontalRule') return '<hr />'
  if (node.type === 'image') {
    const src = escapeHtml(String(node.attrs?.src ?? ''))
    const alt = escapeHtml(String(node.attrs?.alt ?? ''))
    return src ? `<img src="${src}" alt="${alt}" />` : ''
  }
  if (node.type === 'table') return `<table>${renderChildren(node)}</table>`
  if (node.type === 'tableRow') return `<tr>${renderChildren(node)}</tr>`
  if (node.type === 'tableCell') return `<td>${renderChildren(node)}</td>`
  if (node.type === 'tableHeader') return `<th>${renderChildren(node)}</th>`
  if (node.type === 'mediaBlock') {
    const kind = escapeHtml(String(node.attrs?.kind ?? 'file'))
    const name = escapeHtml(String(node.attrs?.name ?? node.attrs?.label ?? 'Attachment'))
    const src = escapeHtml(String(node.attrs?.src ?? ''))
    if (kind === 'video') {
      return `<div class="kairnly-pdf-media"><small>Video</small><strong>${name}</strong><span>Video file is included in the workspace, but PDF export shows it as an attachment card.</span></div>`
    }
    return `<div class="kairnly-pdf-media"><small>${kind}</small><strong>${name}</strong><span>${src}</span></div>`
  }
  return renderChildren(node)
}

function renderPageHtml(page: Page, doc: TiptapDoc) {
  const body = doc.content?.map(renderNode).join('') || '<p></p>'
  return `
    <style>${pageStyle}</style>
    <article class="kairnly-pdf-page">
      <div class="kairnly-pdf-meta">${escapeHtml(page.icon ?? '□')} Kairnly · ${new Date(page.updatedAt).toLocaleString()}</div>
      <h1 class="kairnly-pdf-title">${escapeHtml(page.title || 'Untitled')}</h1>
      ${body}
    </article>
  `
}

function slugify(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9ğüşöçıİĞÜŞÖÇ]+/gi, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70) || 'untitled'
  )
}

async function waitForImages(root: HTMLElement) {
  const images = Array.from(root.querySelectorAll('img'))
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve()
      return new Promise<void>((resolve) => {
        img.onload = () => resolve()
        img.onerror = () => resolve()
      })
    }),
  )
}

async function htmlToPdfBlob(html: string) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')])
  const host = document.createElement('div')
  host.style.position = 'fixed'
  host.style.left = '-10000px'
  host.style.top = '0'
  host.style.width = '794px'
  host.innerHTML = html
  document.body.appendChild(host)
  await waitForImages(host)

  const canvas = await html2canvas(host.querySelector('.kairnly-pdf-page') as HTMLElement, {
    scale: 2,
    backgroundColor: '#fffdf8',
    useCORS: true,
    allowTaint: true,
  })
  document.body.removeChild(host)

  const pdf = new jsPDF('p', 'mm', 'a4')
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const imgData = canvas.toDataURL('image/jpeg', 0.95)

  let remainingHeight = imgHeight
  let y = 0
  pdf.addImage(imgData, 'JPEG', 0, y, imgWidth, imgHeight)
  remainingHeight -= pageHeight

  while (remainingHeight > 0) {
    y -= pageHeight
    pdf.addPage()
    pdf.addImage(imgData, 'JPEG', 0, y, imgWidth, imgHeight)
    remainingHeight -= pageHeight
  }

  return pdf.output('blob')
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function collectPageFamily(rootId: string, pages: Page[]) {
  const out: Page[] = []
  const visit = (pageId: string) => {
    const page = pages.find((item) => item.id === pageId)
    if (!page) return
    out.push(page)
    pages
      .filter((item) => item.parentId === pageId)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .forEach((child) => visit(child.id))
  }
  visit(rootId)
  return out
}

export async function exportPagePdf(page: Page, doc?: TiptapDoc) {
  const pageDoc = doc ?? (await db.loadPageContent(page.id))
  const blob = await htmlToPdfBlob(renderPageHtml(page, pageDoc))
  downloadBlob(blob, `${slugify(page.title)}.pdf`)
}

export async function exportPagesAsPdfZip(pages: Page[], filename: string) {
  const { default: JSZip } = await import('jszip')
  const zip = new JSZip()
  for (const page of pages) {
    const doc = await db.loadPageContent(page.id)
    const blob = await htmlToPdfBlob(renderPageHtml(page, doc))
    zip.file(`${slugify(page.title)}-${page.id.slice(0, 6)}.pdf`, blob)
  }
  const archive = await zip.generateAsync({ type: 'blob' })
  downloadBlob(archive, filename)
}
