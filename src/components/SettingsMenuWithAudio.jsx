import SettingsMenu from "./SettingsMenu";
import { useEffect, useState, useRef } from "react";

export default function SettingsMenuWithAudio({ audioRef }) {
  const [alarmSound, setAlarmSound] = useState("sound1");
  const [alarmVolume, setAlarmVolume] = useState(50);

  useEffect(() => {
    if (!audioRef.current) return;

    if (alarmSound === "mute") {
      audioRef.current.pause();
      audioRef.current.src = "";
      return;
    }

    const soundPath =
      alarmSound === "sound1"
        ? "/sounds/sonidouno.mp3"
        : "/sounds/sonidodos.mp3";

    audioRef.current.src = soundPath;
    audioRef.current.load();
    audioRef.current.volume = alarmVolume / 100;
  }, [alarmSound]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = alarmVolume / 100;
    }
  }, [alarmVolume]);

  return (
    <SettingsMenu
      audioRef={audioRef}
      alarmSound={alarmSound}
      setAlarmSound={setAlarmSound}
      alarmVolume={alarmVolume}
      setAlarmVolume={setAlarmVolume}
    />
  );
}