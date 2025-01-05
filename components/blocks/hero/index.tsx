import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import HappyUsers from "./happy-users";
import HeroBg from "./bg";
import { Hero as HeroType } from "@/types/blocks/hero";
import Icon from "@/components/icon";
import Link from "next/link";
import { Mic2, Music, Sparkles } from "lucide-react";
import MusicEdit from "../music-edit";

export default function Hero({ hero }: { hero: HeroType }) {
  if (hero.disabled) {
    return null;
  }

  const highlightText = hero.highlight_text;
  let texts = null;
  if (highlightText) {
    texts = hero.title?.split(highlightText, 2);
  }

  return (
    <>
      <HeroBg />
      <section className="py-24">
        <div className='container pt-32 text-center relative z-10'>
        <div className='relative'>

        <h1 className='mx-auto text-white max-4xl text-balance font-bold text-5xl lg:text-7xl sm:pb-8 xl:pb-8  animate-floating'>
              AI Music & Song Generator
            </h1>
            <h2 className='text-2xl md:text-3xl font-bold text-gray-400 mb-8'>Just describe it, makesongs in seconds</h2>
            <div className='flex flex-wrap justify-center gap-4 mb-8'>
              <span className='px-4 py-2 bg-gray-800/80 rounded-full backdrop-blur-sm hover:bg-gray-700/80 transition-all duration-300 flex items-center gap-2'>
                <Music className='w-4 h-4 text-purple-400' />
                Text/Lyric to music
              </span>
              <span className='px-4 py-2 bg-gray-800/80 rounded-full backdrop-blur-sm hover:bg-gray-700/80 transition-all duration-300 flex items-center gap-2'>
                <Sparkles className='w-4 h-4 text-pink-400' />
                100% Royalty-free
              </span>
              <span className='px-4 py-2 bg-gray-800/80 rounded-full backdrop-blur-sm hover:bg-gray-700/80 transition-all duration-300 flex items-center gap-2'>
                <Mic2 className='w-4 h-4 text-purple-400' />
                Support Isolate Vocals & Instrumental
              </span>
            </div>
            </div>
            <MusicEdit />

      </div>      
      </section>
    </>
  );
}
