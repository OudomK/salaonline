/**
 * Bunny Storage Utility - Handle file uploads to Bunny CDN Storage
 */

const BUNNY_CONFIG = {
  storageZoneName: import.meta.env.VITE_BUNNY_STORAGE_USERNAME,
  hostName: import.meta.env.VITE_BUNNY_STORAGE_HOST_NAME,
  apiKey: import.meta.env.VITE_BUNNY_STORAGE_PASSWORD,
}

/**
 * Upload a file to Bunny Storage
 * @param {File} file - The file to upload
 * @param {string} path - The path where to store the file (e.g., 'audio/lesson1.mp3')
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<string>} - Returns the public URL of the uploaded file
 */
export async function uploadToBunnyStorage(file, path, onProgress) {
  try {
    // Create FormData
    const formData = new FormData()
    formData.append('file', file)

    // Construct the upload URL
    // Format: https://{storageZoneName}.{hostName}/{path}
    const uploadUrl = `https://${BUNNY_CONFIG.storageZoneName}.${BUNNY_CONFIG.hostName}/${path}`

    // Upload the file
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'AccessKey': BUNNY_CONFIG.apiKey,
      },
      body: file, // Bunny Storage expects the raw file, not FormData
    })

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`)
    }

    // Return the public URL
    // Format: https://{storageZoneName}.{hostName}/{path}
    const publicUrl = `https://${BUNNY_CONFIG.storageZoneName}.${BUNNY_CONFIG.hostName}/${path}`

    return publicUrl
  } catch (error) {
    console.error('Error uploading to Bunny Storage:', error)
    throw error
  }
}

/**
 * Upload an audio/voice file to Bunny Storage
 * @param {File} file - The audio file to upload
 * @param {string} folder - The folder name (e.g., 'audio', 'voice', 'lessons')
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<string>} - Returns the public URL of the uploaded file
 */
export async function uploadAudioToBunny(file, folder = 'audio', onProgress) {
  // Validate file type
  const validAudioTypes = [
    'audio/mpeg', // MP3
    'audio/mp4', // M4A
    'audio/wav', // WAV
    'audio/webm', // WebM audio
    'audio/ogg', // OGG
    'audio/x-m4a', // M4A (alternative)
  ]

  if (!validAudioTypes.includes(file.type)) {
    throw new Error(`Invalid audio file type: ${file.type}`)
  }

  // Generate unique filename with timestamp
  const timestamp = Date.now()
  const extension = file.name.split('.').pop()
  const filename = `${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
  const path = `${folder}/${filename}`

  return uploadToBunnyStorage(file, path, onProgress)
}

/**
 * Delete a file from Bunny Storage
 * @param {string} path - The path of the file to delete (e.g., 'audio/lesson1.mp3')
 * @returns {Promise<void>}
 */
export async function deleteFromBunnyStorage(path) {
  try {
    const deleteUrl = `https://${BUNNY_CONFIG.storageZoneName}.${BUNNY_CONFIG.hostName}/${path}`

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'AccessKey': BUNNY_CONFIG.apiKey,
      },
    })

    if (!response.ok) {
      throw new Error(`Delete failed: ${response.statusText}`)
    }
  } catch (error) {
    console.error('Error deleting from Bunny Storage:', error)
    throw error
  }
}

/**
 * Upload multiple audio files
 * @param {File[]} files - Array of audio files to upload
 * @param {string} folder - The folder name
 * @param {Function} onProgress - Optional progress callback
 * @returns {Promise<string[]>} - Returns array of public URLs
 */
export async function uploadMultipleAudioToBunny(files, folder = 'audio', onProgress) {
  const uploadPromises = files.map((file, index) =>
    uploadAudioToBunny(file, folder, (progress) => {
      if (onProgress) {
        onProgress({ index, total: files.length, progress })
      }
    })
  )

  return Promise.all(uploadPromises)
}

export default {
  uploadToBunnyStorage,
  uploadAudioToBunny,
  deleteFromBunnyStorage,
  uploadMultipleAudioToBunny,
}
