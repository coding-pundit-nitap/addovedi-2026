import HeroCanvas from "./HeroCanvas";
import HeroOverlay from "./HeroOverlay";

export default function Hero() {
    return (
        <section className="relative h-[100dvh] w-full overflow-hidden bg-black">
            <HeroCanvas />
            <HeroOverlay />
        </section>
    );
}
