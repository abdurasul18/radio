import ApiService from "./api";

export const FileService = {
    upload(files: File[]) {
        let formData = new FormData();
       files.forEach(el=>{
         formData.append("files", el);
       })
        return ApiService.formData(`file/upload`, formData);
    },
};

