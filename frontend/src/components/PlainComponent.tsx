// src/components/PlainComponent.jsx
import React from 'react';
import Component1 from './generated/component1';
import '../index.css';

function PlainComponent() {
    return (
        <div className="flex-1 bg-white">
            <div className="h-full w-full bg-accent">
                <Component1 />
            </div>
        </div>
    );
}

export default PlainComponent;