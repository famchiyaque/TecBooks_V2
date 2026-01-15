import React, { useState, useRef } from "react";
import { Mic, Volume2, VolumeX, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/components/lib/utils";

function VoiceMemoButton({ itemId, className }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  // Placeholder audio URL - replace with actual audio file from professor
  // Format: /audio/faq/{itemId}.mp3
  const getAudioUrl = (id) => {
    // TODO: Replace with actual audio file mapping
    return `/audio/faq/${id}.mp3`;
  };

  const audioUrl = getAudioUrl(itemId);

  const handlePlayPause = async () => {
    if (!audioRef.current) {
      // Create audio element if it doesn't exist
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onloadstart = () => setIsLoading(true);
      audio.oncanplay = () => setIsLoading(false);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
        // Audio file not found - show a message or handle gracefully
        console.warn(`Audio file not found for ${itemId}`);
        alert("Voice memo not available yet. Audio file will be added soon.");
        audioRef.current = null;
      };
    }

    const audio = audioRef.current;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        setIsLoading(true);
        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
      } catch (error) {
        console.error("Error playing audio:", error);
        setIsLoading(false);
        alert("Unable to play voice memo. Please try again later.");
      }
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button
        onClick={handlePlayPause}
        variant="outline"
        size="icon"
        className={cn(
          "relative",
          isPlaying && "bg-blue-50 border-blue-300",
          isLoading && "opacity-50 cursor-not-allowed"
        )}
        disabled={isLoading}
        title={
          isPlaying ? "Pause voice memo" : "Play voice memo from professor"
        }
      >
        {isLoading ? (
          <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />
        ) : isPlaying ? (
          <Pause className="h-4 w-4 text-blue-600" />
        ) : (
          <Mic className="h-4 w-4 text-blue-600" />
        )}
      </Button>
      {isPlaying && (
        <span className="text-sm text-gray-600 flex items-center gap-1">
          <Volume2 className="h-3 w-3 animate-pulse" />
          Playing...
        </span>
      )}
    </div>
  );
}

export default VoiceMemoButton;
