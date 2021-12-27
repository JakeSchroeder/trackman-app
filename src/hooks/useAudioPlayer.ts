import { useRef, useState } from "react";

export function useAudioPlayer(audioRef: any, audioProgressRef: any, audioVolumeRef: any) {
  const [isPlaying, setIsPlaying] = useState(false);

  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  //keep track of the animation in miliseconds for animation
  const animationRef = useRef<number>();

  function onLoadedMetadata() {
    if (audioRef.current && audioProgressRef.current && audioVolumeRef.current) {
      const seconds = Math.floor(audioRef.current.duration);
      if (seconds) setDuration(seconds);
      audioProgressRef.current.max = seconds;
      audioRef.current.volume = audioVolumeRef.current.value;
    }
  }

  function updateCurrentTime() {
    if (audioProgressRef.current) setCurrentTime(audioProgressRef.current.value);
  }

  function pause() {
    if (audioRef.current) audioRef.current.pause();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  }

  function whilePlaying() {
    if (audioRef.current && audioProgressRef.current) {
      audioProgressRef.current.value = Math.floor(audioRef.current.currentTime);
      audioProgressRef.current.style.setProperty("--seek-before-width", `${(audioProgressRef.current.value / duration) * 100}%`);
      updateCurrentTime();

      // the song has ended go to the next song
      // if (audioProgressRef.current.value === duration) {
      //   return;
      // }
      animationRef.current = requestAnimationFrame(whilePlaying);
    }
  }

  function changeAudioToPlayHead() {
    if (audioRef.current && audioProgressRef.current) {
      audioRef.current.currentTime = audioProgressRef.current.value;
      setCurrentTime(audioProgressRef.current.value);
      audioProgressRef.current.style.setProperty("--seek-before-width", `${(audioProgressRef.current.value / duration) * 100}%`);
    }
  }

  function changeAudioVolume() {
    if (audioRef.current && audioVolumeRef.current) {
      audioRef.current.volume = audioVolumeRef.current.value;
    }
  }

  function play() {
    if (audioRef.current) audioRef.current.play();
    animationRef.current = requestAnimationFrame(whilePlaying);
  }

  function togglePlaying() {
    const prevState = isPlaying;
    setIsPlaying(!prevState);
    if (!prevState) {
      play();
    } else {
      pause();
    }
  }

  return {
    changeAudioToPlayHead,
    currentTime,
    duration,
    isPlaying,
    onLoadedMetadata,
    togglePlaying,
    changeAudioVolume,
  };
}
