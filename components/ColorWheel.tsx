import React, { useRef, useState, useEffect, useCallback } from 'react';
import type { HSLColor } from '../types';
import { hslToHex, hexToHsl } from '../services/colorService';

interface ColorWheelProps {
    size: number;
    color: HSLColor;
    palette: string[];
    onColorChange: (color: HSLColor) => void;
}

const ColorWheel: React.FC<ColorWheelProps> = ({ size, color, palette, onColorChange }) => {
    const wheelRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const radius = size / 2;

    const handleInteraction = useCallback((e: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent) => {
        if (!wheelRef.current) return;

        const rect = wheelRef.current.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;
        const dx = x - centerX;
        const dy = y - centerY;
        
        const distance = Math.min(centerX, Math.sqrt(dx * dx + dy * dy));
        const angle = Math.atan2(dy, dx);
        
        const newHue = Math.round((angle * 180 / Math.PI + 360) % 360);
        const newSaturation = Math.round((distance / centerX) * 100);

        onColorChange({ h: newHue, s: newSaturation, l: color.l });
    }, [color.l, onColorChange]);

    useEffect(() => {
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return;
            e.preventDefault();
            handleInteraction(e);
        };

        const handleUp = () => {
            setIsDragging(false);
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('mouseup', handleUp);
        window.addEventListener('touchend', handleUp);

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchend', handleUp);
        };
    }, [isDragging, handleInteraction]);

    const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        handleInteraction(e);
    };

    // Calculate main handle position
    const angleRad = color.h * Math.PI / 180;
    const distance = (color.s / 100) * radius;
    const handleX = radius + distance * Math.cos(angleRad);
    const handleY = radius + distance * Math.sin(angleRad);
    const mainHex = hslToHex(color);

    return (
        <div className="flex justify-center items-center">
            <div
                ref={wheelRef}
                className="relative rounded-full cursor-pointer select-none"
                style={{
                    width: size,
                    height: size,
                    background: 'conic-gradient(from 90deg, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)',
                    touchAction: 'none'
                }}
                onMouseDown={handleMouseDown}
                onTouchStart={handleMouseDown}
            >
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, #fff0, #fff)' }}></div>
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle, #0000, #0008)' }}></div>
                
                {/* Palette handles */}
                {palette.map((hex, index) => {
                    if (hex.toLowerCase() === mainHex.toLowerCase()) return null;
                    const pColor = hexToHsl(hex);
                    if (!pColor) return null;

                    const pAngleRad = pColor.h * Math.PI / 180;
                    const pDistance = (pColor.s / 100) * radius;
                    const pX = radius + pDistance * Math.cos(pAngleRad);
                    const pY = radius + pDistance * Math.sin(pAngleRad);
                    
                    return (
                        <div
                            key={`${hex}-${index}`}
                            className="absolute w-4 h-4 rounded-full border-2 border-white/70 shadow-md pointer-events-none"
                            style={{
                                left: pX - 8,
                                top: pY - 8,
                                backgroundColor: hex,
                                transform: 'translateZ(0)'
                            }}
                        ></div>
                    );
                })}
                
                {/* Main color handle */}
                <div
                    className="absolute w-6 h-6 rounded-full border-4 border-white shadow-lg pointer-events-none"
                    style={{
                        left: handleX - 12,
                        top: handleY - 12,
                        backgroundColor: mainHex,
                        transform: 'translateZ(0)'
                    }}
                ></div>
            </div>
        </div>
    );
};

export default ColorWheel;
