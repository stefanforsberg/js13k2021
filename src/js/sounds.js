import CPlayer from "./music/player_small";
import {song, sfxHit} from "./music/song";

export default class Sounds {
    constructor(game) {

        this.game = game;
        this.player = new CPlayer();

        this.soundsLoading = [song, sfxHit]
        // this.soundsLoading = []
        this.sounds = [];
        this.currentlyLoadingIndex = 0;

        this.startedLoading = false;
    }

    load(cb) {

        if(this.game.debug) {
            cb();
            return;
        }

        if(!this.startedLoading) {
            this.player.init(this.soundsLoading[this.currentlyLoadingIndex]);
            this.startedLoading = true;
        }

        if(this.player.generate() < 1) {
            setTimeout(() => this.load(cb), 200);
            return;
        } else {
            const wave = this.player.createWave();
            const audio = document.createElement("audio");
            audio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
            this.sounds.push(audio);

            this.currentlyLoadingIndex++;

            if(this.currentlyLoadingIndex < this.soundsLoading.length) {
                this.player.init(this.soundsLoading[this.currentlyLoadingIndex]);
                this.load(cb);
            } else {
                cb();
            }
        }
    }

    playSong(i) {
        if(this.game.debug) {
            return;
        }

        this.sounds[i].loop = true;
        this.sounds[i].play();
    }

    sfx(i) {
        if(this.game.debug) {
            return;
        }

        this.sounds[i].play();
    }
}