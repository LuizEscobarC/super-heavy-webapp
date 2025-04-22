import React, { useState, useEffect } from 'react';
import './Alert.css';

const Alert = ({message, type = 'success', duration = 3000}) => {
    const [visible, setVisible] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration]);

    if (!visible) return null;

    return (
        <div className={`alert alert-${type}`}>
            {message}
        </div>
    );
};

export default Alert;