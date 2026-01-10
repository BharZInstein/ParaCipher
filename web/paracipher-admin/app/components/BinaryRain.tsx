"use client";

import { useEffect, useRef } from "react";

export default function BinaryRain() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let width = (canvas.width = window.innerWidth);
        let height = (canvas.height = window.innerHeight);
        let columns = Math.floor(width / 20);
        const drops = new Array(columns).fill(1);

        // Mouse interaction
        const mouse = { x: -100, y: -100 };

        const handleResize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.floor(width / 20);
            drops.length = columns;
            drops.fill(1);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener("resize", handleResize);
        window.addEventListener("mousemove", handleMouseMove);

        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = "rgba(5, 5, 5, 0.05)";
            ctx.fillRect(0, 0, width, height);

            ctx.font = "15px 'JetBrains Mono'";

            for (let i = 0; i < drops.length; i++) {
                // Random binary character
                const text = Math.random() > 0.5 ? "1" : "0";

                // Calculate distance to mouse
                const x = i * 20;
                const y = drops[i] * 20;
                const dist = Math.hypot(x - mouse.x, y - mouse.y);

                // Highlight near mouse
                if (dist < 100) {
                    ctx.fillStyle = "#ffffff"; // Bright white near mouse
                } else {
                    ctx.fillStyle = "#0F3315"; // Very faint green/grey otherwise
                }

                ctx.fillText(text, x, y);

                // Reset drop to top randomly
                if (drops[i] * 20 > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none opacity-40 bg-[var(--background)]"
        />
    );
}
