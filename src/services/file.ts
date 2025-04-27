import ApiService from "./api";

export const FileService = {
    upload(file: File) {
        let formData = new FormData();
        formData.append("file", file);
        return ApiService.formData(`file/upload`, formData);
    },
};

