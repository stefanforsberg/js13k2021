export default class Menu {
    constructor() {
        this.visible = false;
        this.menuContainer = document.getElementById("menu")
    }

    handleKey(code, pressed) {

    }

    toggle() {
        this.visible = !this.visible;

        this.menuContainer.style.display = this.visible ? 'block' : 'none';

        return this.visible;
    }
}