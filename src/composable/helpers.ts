import { NButton } from "naive-ui";
import DeleteModalContent from "./modal/DeleteModalContent.vue";
import CIconButton from "../components/ui/CIconButton.vue";
import ConfirmModalContent from "./modal/ConfirmModalContent.vue";


export function confirmDelete(modal: any) {
  return new Promise((resolve, reject) => {
    let m = modal.create({
      preset: 'card',
      style: {
        maxWidth: '520px'
      },
      class: "confirm-card",
      headerExtra: () => h(CIconButton, { icon: 'times', onClick: () => { reject(false), m.destroy() } }),
      content: () => h(DeleteModalContent, { onCancel: () => { reject(false), m.destroy() }, onSuccess: () => { resolve(true), m.destroy() } }),
    })
  })
}



export function confirmAction(modal: any, title?: string) {
  return new Promise((resolve, reject) => {
    let m = modal.create({
      preset: 'card',
      style: {
        maxWidth: '520px'
      },
      class: "confirm-card",
      headerExtra: () => h(CIconButton, { icon: 'times', onClick: () => { reject(false), m.destroy() } }),
      content: () => h(ConfirmModalContent, { title: title, onCancel: () => { reject(false), m.destroy() }, onSuccess: () => { resolve(true), m.destroy() } }),
    })
  })
}