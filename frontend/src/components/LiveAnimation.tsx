import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "./live svg.json";

const LiveAnimation = () => {
    const container = useRef<HTMLDivElement>(null); // Explicitly type the ref

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: container.current!,
            renderer: "svg",
            loop: true,
            autoplay: true,
            animationData: animationData,
        });

        return () => {
            animation.stop();
            animation.destroy();
        };
    }, []);

    return <div className="w-7 h-7" ref={container}></div>;
};

export default LiveAnimation;
