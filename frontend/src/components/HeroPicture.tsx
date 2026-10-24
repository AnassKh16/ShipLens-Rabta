import { useTranslation } from 'react-i18next';
import desktopAvif from '../assets/images/hero-desktop-1920.avif';
import desktopSmallAvif from '../assets/images/hero-desktop-960.avif';
import desktopWebp from '../assets/images/hero-desktop-1920.webp';
import desktopSmallWebp from '../assets/images/hero-desktop-960.webp';
import mobileAvif from '../assets/images/hero-mobile-720.avif';
import mobileWebp from '../assets/images/hero-mobile-720.webp';
export function HeroPicture() {
  const { t } = useTranslation();
  return <picture>
    <source media="(max-width: 767px)" type="image/avif" srcSet={mobileAvif} width={720} height={900} />
    <source media="(max-width: 767px)" type="image/webp" srcSet={mobileWebp} width={720} height={900} />
    <source type="image/avif" srcSet={`${desktopSmallAvif} 960w, ${desktopAvif} 1920w`} sizes="100vw" width={1920} height={1080} />
    <img src={desktopWebp} srcSet={`${desktopSmallWebp} 960w, ${desktopWebp} 1920w`} sizes="100vw" width={1920} height={1080} fetchPriority="high" alt={t('image.heroAlt')} />
  </picture>;
}
