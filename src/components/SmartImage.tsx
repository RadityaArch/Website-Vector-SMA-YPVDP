import { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function SmartImage({
  src,
  alt,
  className = '',
  fallbackLabel,
}: SmartImageProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  if (!src || failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#e7f0fc] to-[#d6e4f7] text-[#1e3a8a] p-6 text-center ${className}`}
      >
        <Cpu className="w-8 h-8 opacity-65" aria-hidden="true" />
        <span className="text-xs font-medium text-[#1e3a8a]/80 max-w-[22ch] leading-snug">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
