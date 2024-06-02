import React from 'react';
import { MoonLoader, ScaleLoader } from 'react-spinners';

interface LoaderProps {
    variant: 'moonloader' | 'scaleloader';
    loading: boolean;
    height?: number;
    width?: number;
    color?: string;
}

const Loader = ({ variant, loading, height, width, color }: LoaderProps) => {
    const LoaderComponent = variant === "moonloader" ? MoonLoader : ScaleLoader;

    return (
        <LoaderComponent color={color} loading={loading} height={height} width={width} />
    );
};

export default Loader;
