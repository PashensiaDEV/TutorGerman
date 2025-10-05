import { ClassesResponsiveHider } from './components/ResponsiveHider';
import './css/styles.css';
import './icons/arrow.svg';
import './icons/FacebookIcon.svg';
import './icons/InstagramIcon.svg';

const options = {
  classNames: ['article__header-logo','header__actions','article__about-school','article__subjects','article__dekstop-footer']
}

const siteHider = new ClassesResponsiveHider(options);

siteHider.init();