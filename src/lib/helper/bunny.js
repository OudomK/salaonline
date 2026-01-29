import * as tus from "tus-js-client";

const uploadToBunny = ({
    file,
    uploadData,
    onProgress,
    onInstance,
}) => {
    return new Promise((resolve, reject) => {
        const upload = new tus.Upload(file, {
            endpoint: uploadData?.endpoint,
            headers: {
                AuthorizationSignature: uploadData?.headers?.AuthorizationSignature,
                AuthorizationExpire: uploadData?.headers?.AuthorizationExpire,
                VideoId: uploadData?.headers?.VideoId,
                LibraryId: uploadData?.headers?.LibraryId,
            },
            metadata: {
                filename: file?.name,
                filetype: file?.type,
            },
            onError(error) {
                console.log(error, 'error');
                reject(error);
            },
            onProgress(bytesUploaded, bytesTotal) {
                const percentage = (bytesUploaded / bytesTotal) * 100;
                onProgress?.(percentage);
            },
            onSuccess() {
                resolve();
            },
        });

        // Pass the instance back to the caller for registration/cancellation
        onInstance?.(upload);

        // Start upload
        upload.start();
    });
};

export { uploadToBunny };
