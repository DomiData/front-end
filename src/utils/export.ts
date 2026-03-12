const buildTimestamp = () => new Date().toISOString().replace(/[:.]/g, '-')

const sanitizeFileNamePart = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_]/g, '')

export const createExportFileName = (
  prefix: string,
  extension: 'csv' | 'xlsx'
) => `${sanitizeFileNamePart(prefix)}-${buildTimestamp()}.${extension}`

export const getFileNameFromDisposition = (
  contentDisposition?: string | null
) => {
  if (!contentDisposition) {
    return null
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1])
  }

  const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i)
  return basicMatch?.[1] || null
}

export const downloadBlobFile = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')

  anchor.href = url
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)

  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
