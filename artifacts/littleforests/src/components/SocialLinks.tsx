import { Facebook, Instagram } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/little_forestnursery?igsh=NzloYjNveHVybTZo&utm_source=qr';
const FACEBOOK_URL = '';

interface SocialLinksProps {
  compact?: boolean;
  className?: string;
}

const SocialLinks = ({ compact = false, className = '' }: SocialLinksProps) => {
  const buttonSize = compact ? 'h-11 w-11' : 'h-14 w-14';
  const iconSize = compact ? 'h-5 w-5' : 'h-7 w-7';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="LittleForest Nursery on Instagram"
        title="Instagram"
        style={{
          background: 'linear-gradient(135deg, #F58529 0%, #DD2A7B 52%, #515BD4 100%)',
        }}
        className={`inline-flex ${buttonSize} items-center justify-center rounded-full border-2 border-white text-white shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
      >
        <Instagram className={iconSize} strokeWidth={2.2} />
      </a>

      {FACEBOOK_URL ? (
        <a
          href={FACEBOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LittleForest Nursery on Facebook"
          title="Facebook"
          className={`inline-flex ${buttonSize} items-center justify-center rounded-full border-2 border-white bg-[#1877F2] text-white shadow-md transition-transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2`}
        >
          <Facebook className={iconSize} fill="currentColor" />
        </a>
      ) : (
        <span
          role="img"
          aria-disabled="true"
          aria-label="Facebook"
          title="Facebook"
          className={`inline-flex ${buttonSize} items-center justify-center rounded-full border-2 border-white bg-[#1877F2] text-white shadow-md`}
        >
          <Facebook className={iconSize} fill="currentColor" />
        </span>
      )}
    </div>
  );
};

export default SocialLinks;