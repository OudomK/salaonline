import apiClient from '../client'


export const fileFolder = {
    HOMEWORK_IMAGE: 'image/homework',
    COURSE_THUMBNAIL: 'image/course',
    HOMEWORK_AUDIO: 'audio/homework',
    AVATAR: 'image/avatar',
}

export const fileService = {
    uploadFile: (file, folder) => {
        const form = new FormData();
        form.append('file', file);
        return apiClient.post('/third-party/media/upload', form, {
            params: {
                folder,
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
    },
}
