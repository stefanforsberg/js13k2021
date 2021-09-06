export default class Powerup {
    constructor(game) {
        this.game = game;
        this.visible = false;
        this.menuContainer = document.getElementById("menu")
        this.powerupsElement = document.getElementById("powerups")
        this.powerupsDesc = document.getElementById("powerupdesc")
        this.powerupcost = document.getElementById("powerupcost")


        this.spent = 0;

        this.reset();

        this.setBase();
    }

    handleKey(code, pressed) {

    }

    toggle() {
        this.visible = !this.visible;

        if(this.visible) {

            this.upgradeCost();

            this.powerupsElement.innerHTML = this.powerups.map((p, i) => `<div data-tooltip="${p.d}" class="powerup${p.a? " active" : ""}" data-i="${i}">${p.i}</div>`).join("")

            document.querySelectorAll(".powerup").forEach(e => {
                
                
                    e.addEventListener("click", () => {

                        if(!e.classList.contains("active")) {


                            if(this.game.hud.mineral >= this.nextCost) {
                                e.classList.toggle("active");

                                this.powerups[e.dataset.i].a = e.classList.contains("active");

                                this.spent += this.nextCost;

                                this.game.hud.increaseMineral(-this.nextCost);

                                this.upgradeCost();

                                
                            }
                            
                            

                            

                        }
                    })
                

                e.addEventListener("mouseenter", () => {
                    this.powerupsDesc.innerHTML = e.dataset.tooltip;
                    this.powerupsDesc.style.visibility = 'visible';
                });

                e.addEventListener("mouseleave", () => {
                    this.powerupsDesc.style.visibility = 'hidden';
                });
                
            });
        } else {

            this.setBase();

            document.querySelectorAll(".powerup.active").forEach(e => {
                this.powerups[e.dataset.i].f(this.powerUpsSettings);
            })

        }

        this.menuContainer.style.display = this.visible ? 'flex' : 'none';

        return this.visible;
    }

    upgradeCost() {
        this.nextCost = this.powerups.filter((p) => p.a).length + 1;

        this.powerupcost.innerHTML = `Next upgrade ${this.nextCost} (inventory ${this.game.hud.mineral})`
    }

    reset() {
        this.powerups = [
            {i:"💨", d:"+max speed", a: false, f: (p) => p.s.maxVelocity++},
            {i:"💨", d:"+max speed", a: false, f: (p) => p.s.maxVelocity++},
            {i:"💣", d:"+bomb area", a: false, f: (p) => p.b.size+=1},
            {i:"💣", d:"+bomb area", a: false, f: (p) => p.b.size+=1},
            {i:"💣", d:"+bomb area", a: false, f: (p) => p.b.size+=1},
            {i:"🔫", d:"+bullets", a: false, f: (p) => p.g.bullets+=1},
            {i:"🔫", d:"+bullets", a: false, f: (p) => p.g.bullets+=1},
            {i:"🔫", d:"+bullets", a: false, f: (p) => p.g.bullets+=1},
            {i:"🔫", d:"+aim with mouse", a: false, f: (p) => p.g.mouseAim=true},
            {i:"🔫", d:"+bullet penetration", a: false, f: (p) => p.g.bulletLife+=1},
            {i:"🔫", d:"+bullet penetration", a: false, f: (p) => p.g.bulletLife+=1},
            {i:"🔫", d:"+bullet penetration", a: false, f: (p) => p.g.bulletLife+=1},
        ]
    }

    setBase() {
        this.powerUpsSettings = {
            s: {
                maxVelocity: 2
            },
            b: {
                size: 1
            },
            g: {
                mouseAim: false,
                bullets: 1,
                bulletLife: 0
            }
        };
    }
}