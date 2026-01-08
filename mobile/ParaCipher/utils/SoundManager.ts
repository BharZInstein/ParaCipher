import { Audio } from 'expo-av';

/**
 * Sound Manager Utility
 * 
 * Manages preloading and playback of UI sound effects.
 */
class SoundManager {
    private sounds: { [key: string]: Audio.Sound } = {};

    private audioFiles = {
        click: require('../assets/sound/sci-fi-click-900.wav'),
        success: require('../assets/sound/sci-fi-confirmation-914.wav'),
        tab: require('../assets/sound/sci-fi-transition-sweep-3114.wav'),
        error: require('../assets/sound/error-sound-effect.mp3'),
    };

    /**
     * Preloads all sound assets
     */
    async loadSounds() {
        try {
            const keys = Object.keys(this.audioFiles) as (keyof typeof this.audioFiles)[];

            // Set audio mode to allow playback in silent mode (iOS)
            await Audio.setAudioModeAsync({
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
            });

            const loadPromises = keys.map(async (key) => {
                const { sound } = await Audio.Sound.createAsync(this.audioFiles[key]);
                this.sounds[key] = sound;
            });

            await Promise.all(loadPromises);
        } catch (error) {
            console.warn('Failed to load sounds', error);
        }
    }

    /**
     * Unloads all sound assets
     */
    async unloadSounds() {
        try {
            const unloadPromises = Object.values(this.sounds).map(sound => sound.unloadAsync());
            await Promise.all(unloadPromises);
            this.sounds = {};
        } catch (error) {
            console.warn('Failed to unload sounds', error);
        }
    }

    /**
     * Plays a specific sound by key
     */
    /**
     * Plays a specific sound by key
     */
    private async play(key: string, volume: number = 0.2) {
        try {
            const sound = this.sounds[key];
            if (sound) {
                // Reset position and play with volume
                await sound.replayAsync({ volume, shouldPlay: true });
            }
        } catch (error) {
            // Ignore playback errors
        }
    }

    playClick = () => this.play('click', 0.15);
    playSuccess = () => this.play('success', 0.2);
    playTab = () => this.play('tab', 0.12);
    playError = () => this.play('error', 0.3);
}

export const AppSounds = new SoundManager();
