import Lottie from "lottie-react";
import animation from "../../animations/arrowRight.json";
import styles from './styles.module.css';

export function ArrowRightAnimate({ open }) {
    return open && <Lottie animationData={animation} loop className={styles.animate} />
}