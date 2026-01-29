import * as tus from "tus-js-client";

const uploadToBunny = async ({
    file,
    uploadData,
    onProgress,
    onSuccess,
    onError,
}) => {
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
        retryDelays: [0, 3000, 5000, 10000],

        onError(error) {
            onError?.(error);
        },

        onProgress(bytesUploaded, bytesTotal) {
            const percentage = Math.floor(
                (bytesUploaded / bytesTotal) * 100
            );
            onProgress?.(percentage);
        },

        onSuccess() {
            onSuccess?.();
        },
    });

    upload.start();
};

export { uploadToBunny };
