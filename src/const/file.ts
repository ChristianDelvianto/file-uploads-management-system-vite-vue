export const CSV_TYPE: string = 'text/csv'
export const DOCX_TYPE: string = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
export const EXCEL_TYPE: string = 'application/vnd.ms-excel'
export const JSON_TYPE: string = 'application/json'
export const PDF_TYPE: string = 'application/pdf'
export const PPT_TYPE: string = 'application/vnd.ms-powerpoint'
export const PPTX_TYPE: string = 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
export const TEXT_TYPE: string = 'text/plain'
export const WORD_TYPE: string = 'application/msword'
export const XLSX_TYPE: string = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
export const XML_TYPE: string = 'application/xml'

export const ALLOWED_DOCUMENT_TYPES: string[] = [
    DOCX_TYPE,
    EXCEL_TYPE,
    PDF_TYPE,
    PPT_TYPE,
    PPTX_TYPE,
    TEXT_TYPE,
    WORD_TYPE,
    XLSX_TYPE
] as const

export const GENERATED_THUMBNAIL_MIME_TYPE: string = import.meta.env.VITE_GENERATED_THUMBNAIL_MIME_TYPE || 'image/jpeg'

export const GENERATED_THUMBNAIL_QUALITY: number = import.meta.env.VITE_GENERATED_THUMBNAIL_QUALITY
    ? parseFloat(import.meta.env.VITE_GENERATED_THUMBNAIL_QUALITY)
    : 0.25

export const MAXIMUM_SHARED_USERS_LENGTH: number = 5
