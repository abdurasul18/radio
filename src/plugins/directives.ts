import { dragscroll } from 'vue-dragscroll'
export default (app: any) => {
    app.directive('dragscroll', dragscroll)
}