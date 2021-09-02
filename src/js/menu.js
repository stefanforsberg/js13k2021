export default class Menu {
    constructor() {
        this.visible = false;
        this.menuContainer = document.getElementById("menu")
        this.powerupsElement = document.getElementById("powerups")

        this.powerups = [
            {i:"💨", d:"+max speed", a: false, f: (p) => p.s.maxVelocity++},
            {i:"💨", d:"+max speed", a: false, f: (p) => p.s.maxVelocity++},
            {i:"💣", d:"+max speed", a: false, f: (p) => p.b.size+=2},
            {i:"💣", d:"+max speed", a: false, f: (p) => p.b.size+=2},
            {i:"💣", d:"+max speed", a: false, f: (p) => p.b.size+=2},
            {i:"🔫", d:"+bullets", a: false, f: (p) => p.g.bullets+=1},
            {i:"🔫", d:"+bullets", a: false, f: (p) => p.g.bullets+=1},
            {i:"🔫", d:"+bullets", a: false, f: (p) => p.g.bullets+=1},


            
        ]

        this.setBase();
    }

    handleKey(code, pressed) {

    }

    toggle() {
        this.visible = !this.visible;

        if(this.visible) {
            this.powerupsElement.innerHTML = this.powerups.map((p, i) => `<div class="powerup${p.a? " active" : ""}" data-i="${i}">${p.i}</div>`).join("")

            document.querySelectorAll(".powerup").forEach(e => {
                e.addEventListener("click", () => {
                    
                    e.classList.toggle("active");
                    this.powerups[e.dataset.i].a = e.classList.contains("active");
                })
                
            });
        } else {

            this.setBase();

            document.querySelectorAll(".powerup.active").forEach(e => {
                this.powerups[e.dataset.i].f(this.powerUpsSettings);
            })

        }

        this.menuContainer.style.display = this.visible ? 'block' : 'none';

        return this.visible;
    }

    setBase() {
        this.powerUpsSettings = {
            s: {
                maxVelocity: 3
            },
            b: {
                size: 1
            },
            g: {
                bullets: 1
            }
        };
    }
}