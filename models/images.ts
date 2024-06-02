export interface RowData {
    picture: string
    status: string
    originalFileName: string
    id: string
}
export interface UploadImagesAPIResponse { id: string, filename: string }
export interface imageAssociatedWithIds { id: string, originalFileName: string }
export interface statusUpdateMessage { fileId: string, status: string, url: string }