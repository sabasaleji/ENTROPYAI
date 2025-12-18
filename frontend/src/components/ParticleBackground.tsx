import React, { useEffect, useRef } from 'react';

const ParticleBackground: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Generate 50 particles with random positions
        const particles: JSX.Element[] = [];
        for (let i = 0; i < 50; i++) {
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            const delay = Math.random() * 20;
            const duration = 15 + Math.random() * 10;

            particles.push(
                <div
                    key={i}
                    className="particle"
                    style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        animationDelay: `${delay}s`,
                        animationDuration: `${duration}s`,
                    }}
                />
            );
        }

        // Add particles to container
        const container = containerRef.current;
        container.innerHTML = '';
        particles.forEach((particle) => {
            const div = document.createElement('div');
            div.className = 'particle';
            div.style.left = particle.props.style.left;
            div.style.top = particle.props.style.top;
            div.style.animationDelay = particle.props.style.animationDelay;
            div.style.animationDuration = particle.props.style.animationDuration;
            container.appendChild(div);
        });
    }, []);

    return <div ref={containerRef} className="bg-particles" />;
};

export default ParticleBackground;
