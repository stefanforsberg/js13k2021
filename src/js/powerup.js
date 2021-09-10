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
                
                    console.log("pw");
                    
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
        const current = this.powerups.filter((p) => p.a).length;
        this.nextCost = current*current*0.5 | 0;

        this.powerupcost.innerHTML = `Next ${this.nextCost} 🌒 (inv ${this.game.hud.mineral} 🌒)`
    }

    reset() {

        this.powerups = [];
        this.powerups.push(...Array(5).fill().map(_ => {return {i:"💨", d:"+max speed", a: false, f: (p) => p.s.maxVelocity+=0.4}}))
        this.powerups.push(...Array(5).fill().map(_ => {return {i:"💣", d:"+bomb area", a: false, f: (p) => p.b.size+=1}}))
        this.powerups.push(...Array(5).fill().map(_ => {return {i:"💣", d:"-bomb cooldown", a: false, f: (p) => p.b.cooldown-=500}}))
        this.powerups.push(...Array(4).fill().map(_ => {return {i:"🔫", d:"+bullets fired", a: false, f: (p) => p.g.bullets+=1}}))
        this.powerups.push(...Array(5).fill().map(_ => {return {i:"🔫", d:"-gun cooldown", a: false, f: (p) => p.g.cooldown-=50}}))
        this.powerups.push(...Array(3).fill().map(_ => {return {i:"🔫", d:"+bullet piercing", a: false, f: (p) => p.g.bulletLife+=1}}))
        this.powerups.push(...Array(5).fill().map(_ => {return {i:"🧲", d:"+pickup radius", a: false, f: (p) => p.s.pickupRadius+=20}}))
        this.powerups.push(...Array(5).fill().map(_ => {return {i:"🛡️", d:"+shield duration", a: false, f: (p) => p.s.shieldDuration+=100}}))
        this.powerups.push(...Array(5).fill().map(_ => {return {i:"🛡️", d:"+shield cooldown", a: false, f: (p) => p.s.shieldCooldown-=500}}))
        this.powerups.push({i:"🔫", d:"+aim with mouse", a: false, f: (p) => p.g.mouseAim=true});

        
    }

    setBase() {
        this.powerUpsSettings = {
            s: {
                maxVelocity: 2,
                pickupRadius: 50,
                shieldDuration: 2000,
                shieldCooldown: 5000
            },
            b: {
                size: 1,
                cooldown: 5000,
            },
            g: {
                cooldown: 400,
                mouseAim: false,
                bullets: 1,
                bulletLife: 0
            }
        };
    }
}