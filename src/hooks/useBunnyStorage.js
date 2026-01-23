import { useState, useCallback } from 'react'
import {
  uploadAudioToBunny,
  uploadMultipleAudioToBunny,
  deleteFromBunnyStorage,
} from '../lib/bunnyStorage'

/**
 * Custom hook for uploading audio/voice files to Bunny Storage
 */
export function useBunnyStorage() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const [url, setUrl] = useState(null)

  /**
   * Upload a single audio file
   */
  const uploadAudio = useCallback(async (file, folder = 'audio') => {
    setUploading(true)
    setProgress(0)
    setError(null)
    setUrl(null)

    try {
      const publicUrl = await uploadAudioToBunny(file, folder, (prog) => {
        setProgress(prog)
      })
      setUrl(publicUrl)
      return publicUrl
    } catch (err) {
      setError(err.message || 'Upload failed')
      throw err
    } finally {
      setUploading(false)
    }
  }, [])

  /**
   * Upload multiple audio files
   */
  const uploadMultipleAudio = useCallback(async (files, folder = 'audio') => {
    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      const urls = await uploadMultipleAudioToBunny(files, folder, (prog) => {
        setProgress(prog.progress)
      })
      return urls
    } catch (err) {
      setError(err.message || 'Upload failed')
      throw err
    } finally {
      setUploading(false)
    }
  }, [])

  /**
   * Delete a file from Bunny Storage
   */
  const deleteFile = useCallback(async (path) => {
    setError(null)
    try {
      await deleteFromBunnyStorage(path)
    } catch (err) {
      setError(err.message || 'Delete failed')
      throw err
    }
  }, [])

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setUploading(false)
    setProgress(0)
    setError(null)
    setUrl(null)
  }, [])

  return {
    uploadAudio,
    uploadMultipleAudio,
    deleteFile,
    uploading,
    progress,
    error,
    url,
    reset,
  }
}

export default useBunnyStorage
