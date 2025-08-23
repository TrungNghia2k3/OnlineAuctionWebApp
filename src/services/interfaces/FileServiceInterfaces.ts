/**
 * File Service Interfaces
 * Contains all file-related service abstractions
 */

import { BaseResponse } from '@/types'

export interface IFileService {
  uploadFile(file: File, folder?: string): Promise<BaseResponse<string>>
  uploadFiles(files: File[], folder?: string): Promise<BaseResponse<string[]>>
  deleteFile(url: string): Promise<BaseResponse<void>>
  getFileInfo(url: string): Promise<BaseResponse<any>>
}
