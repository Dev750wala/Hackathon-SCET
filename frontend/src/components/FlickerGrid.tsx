import FlickeringGrid from "./ui/flickering-grid";

export function FlickeringGridd() {
    return (
        <div className="fixed top-0 left-0 h-full w-full bg-black overflow-hidden -z-50">
            <FlickeringGrid
                className="absolute inset-0 w-full h-full"
                squareSize={4}
                gridGap={6}
                color="#6B7280"  
                maxOpacity={0.5}
                flickerChance={0.1}
            />
        </div>
    );
}
