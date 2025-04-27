import { useToast } from "vue-toast-notification";
import { i18n } from "./i18n";
export const toast = useToast({
    position: 'top-right',
    duration: 5000
});

export const toastSuccess = () => {
    toast.success('Muvafaqqiyatli bajarildi');
}
export const toastI18n = (key: string, type = 'success' as 'success' | 'warning' | 'error') => {
    toast[type](i18n.global.t(key));
}