import React from 'react';
import { Box } from '@mui/material';

const PixelBusinessman = ({ emotion = 'neutral', cashTrend = 0 }) => {
  // Determine emotion based on cash trend
  const getEmotion = () => {
    if (cashTrend < -20) return 'panicked';
    if (cashTrend < -5) return 'worried';
    if (cashTrend > 5) return 'happy';
    return 'neutral';
  };

  const currentEmotion = emotion || getEmotion();

  const businessmanStyles = {
    width: '100px',
    height: '150px',
    position: 'relative',
    imageRendering: 'pixelated',
    margin: '0 auto',
  };

  const getBusinessmanSVG = () => {
    const backgroundElements = (
      <>
        {/* Window with city view */}
        <rect x="10" y="10" width="30" height="40" fill="#87CEEB" />
        <rect x="10" y="10" width="30" height="40" stroke="#2c3e50" strokeWidth="2" fill="none" />
        <rect x="24" y="10" width="2" height="40" fill="#2c3e50" />
        <rect x="10" y="29" width="30" height="2" fill="#2c3e50" />
        {/* City buildings in window */}
        <rect x="15" y="30" width="8" height="15" fill="#34495e" />
        <rect x="27" y="35" width="8" height="10" fill="#34495e" />
        
        {/* Office plant */}
        <rect x="75" y="80" width="10" height="8" fill="#e67e22" />
        <path d="M77,80 L80,65 L83,80" fill="#27ae60" />
        <path d="M75,75 L80,65 L85,75" fill="#27ae60" />
        
        {/* Desk */}
        <rect x="20" y="110" width="60" height="5" fill="#95a5a6" />
        <rect x="25" y="115" width="50" height="30" fill="#7f8c8d" />
        
        {/* Computer */}
        <rect x="30" y="95" width="20" height="15" fill="#2c3e50" />
        <rect x="31" y="96" width="18" height="13" fill="#3498db" />
        <rect x="35" y="110" width="10" height="2" fill="#2c3e50" />
        <rect x="37" y="112" width="6" height="1" fill="#2c3e50" />
        
        {/* Coffee cup */}
        <rect x="55" y="100" width="8" height="10" fill="#e74c3c" />
        <rect x="53" y="98" width="12" height="2" fill="#c0392b" />
        <path d="M63,100 Q65,103 63,106" stroke="#c0392b" strokeWidth="1" fill="none" />
      </>
    );

    switch (currentEmotion) {
      case 'dead':
        return (
          <svg viewBox="0 0 100 150" style={businessmanStyles}>
            {backgroundElements}
            {/* Body and head group - fallen over */}
            <g transform="translate(50 75) rotate(-90) translate(-50 -75)">
              {/* Body */}
              <rect x="30" y="50" width="40" height="60" fill="#2c3e50" />
              {/* Head */}
              <circle cx="50" cy="40" r="20" fill="#f1c40f" />
              {/* X eyes - adjusted to be visible */}
              <path d="M37,32 L43,38 M43,32 L37,38" stroke="#2c3e50" strokeWidth="2" />
              <path d="M57,32 L63,38 M63,32 L57,38" stroke="#2c3e50" strokeWidth="2" />
              {/* Tongue sticking out - adjusted to be visible */}
              <path d="M45,45 L50,50 L55,45" fill="#e74c3c" />
              {/* Tie - slightly askew */}
              <path d="M45,50 L50,60 L55,50" fill="#e74c3c" transform="rotate(15 50 55)" />
              {/* Optional: Add some "dizzy" marks */}
              <path d="M75,30 L80,35 M77,28 L82,33 M79,32 L84,37" stroke="#2c3e50" strokeWidth="1" />
            </g>
          </svg>
        );
      case 'happy':
        return (
          <svg viewBox="0 0 100 150" style={businessmanStyles}>
            {backgroundElements}
            {/* Background money symbols */}
            <g className="money-symbols" style={{
              animation: 'float 2s infinite alternate ease-in-out',
            }}>
              <text x="20" y="30" fill="#2ecc71" fontSize="12">$</text>
              <text x="75" y="40" fill="#2ecc71" fontSize="12">$</text>
              <text x="85" y="70" fill="#2ecc71" fontSize="12">$</text>
              <text x="15" y="80" fill="#2ecc71" fontSize="12">$</text>
            </g>
            {/* Suit */}
            <rect x="30" y="50" width="40" height="60" fill="#2c3e50" />
            {/* Shirt collar */}
            <path d="M35,50 L45,55 L50,50 L55,55 L65,50" fill="#fff" />
            {/* Suit lapels */}
            <path d="M35,50 L40,80 L45,50" fill="#34495e" />
            <path d="M65,50 L60,80 L55,50" fill="#34495e" />
            {/* Head */}
            <circle cx="50" cy="40" r="20" fill="#f1c40f" />
            {/* Hair */}
            <path d="M30,40 Q50,35 70,40" fill="none" stroke="#2c3e50" strokeWidth="4" />
            {/* Sparkling eyes */}
            <g className="sparkly-eyes" style={{
              animation: 'twinkle 1s infinite alternate ease-in-out',
            }}>
              <circle cx="40" cy="35" r="3" fill="#2c3e50" />
              <circle cx="60" cy="35" r="3" fill="#2c3e50" />
              <circle cx="38" cy="33" r="1" fill="#fff" />
              <circle cx="58" cy="33" r="1" fill="#fff" />
            </g>
            {/* Big smile with teeth */}
            <path d="M40,45 Q50,55 60,45" stroke="#2c3e50" strokeWidth="2" fill="#fff" />
            <path d="M43,45 L57,45" stroke="#2c3e50" strokeWidth="1" />
            {/* Rosy cheeks */}
            <circle cx="35" cy="42" r="3" fill="#e74c3c" opacity="0.3" />
            <circle cx="65" cy="42" r="3" fill="#e74c3c" opacity="0.3" />
            {/* Tie */}
            <path d="M45,50 L50,60 L55,50 Z" fill="#e74c3c" />
            <path d="M48,60 L50,75 L52,60" fill="#c0392b" />
            {/* Pocket square */}
            <rect x="60" y="55" width="5" height="5" fill="#fff" />
            {/* Add some style for animations */}
            <style>
              {`
                @keyframes float {
                  0% { transform: translateY(0); }
                  100% { transform: translateY(-5px); }
                }
                @keyframes twinkle {
                  0% { transform: scale(1); }
                  100% { transform: scale(1.2); }
                }
                .money-symbols {
                  opacity: 0.6;
                }
                .sparkly-eyes {
                  transform-origin: center;
                }
              `}
            </style>
          </svg>
        );
      case 'worried':
        return (
          <svg viewBox="0 0 100 150" style={businessmanStyles}>
            {backgroundElements}
            {/* Body */}
            <rect x="30" y="50" width="40" height="60" fill="#2c3e50" />
            {/* Head */}
            <circle cx="50" cy="40" r="20" fill="#f1c40f" />
            {/* Eyes */}
            <circle cx="40" cy="35" r="3" fill="#2c3e50" />
            <circle cx="60" cy="35" r="3" fill="#2c3e50" />
            {/* Worried mouth */}
            <path d="M40,45 Q50,40 60,45" stroke="#2c3e50" strokeWidth="2" fill="none" />
            {/* Sweat drop */}
            <circle cx="65" cy="30" r="2" fill="#3498db" />
            {/* Tie */}
            <path d="M45,50 L50,60 L55,50" fill="#e74c3c" />
          </svg>
        );
      case 'panicked':
        return (
          <svg viewBox="0 0 100 150" style={businessmanStyles}>
            {backgroundElements}
            {/* Add falling papers in panic */}
            <g className="falling-papers" style={{
              animation: 'fall 3s infinite linear',
            }}>
              <rect x="20" y="40" width="10" height="12" fill="#fff" transform="rotate(15)" />
              <rect x="70" y="60" width="10" height="12" fill="#fff" transform="rotate(-20)" />
              <rect x="40" y="30" width="10" height="12" fill="#fff" transform="rotate(45)" />
            </g>
            {/* Body */}
            <rect x="30" y="50" width="40" height="60" fill="#2c3e50" />
            {/* Head */}
            <circle cx="50" cy="40" r="20" fill="#f1c40f" />
            {/* Panicked eyes */}
            <rect x="38" y="32" width="4" height="6" fill="#2c3e50" />
            <rect x="58" y="32" width="4" height="6" fill="#2c3e50" />
            {/* Open mouth */}
            <ellipse cx="50" cy="45" rx="8" ry="5" fill="#e74c3c" />
            {/* Multiple sweat drops */}
            <circle cx="65" cy="30" r="2" fill="#3498db" />
            <circle cx="70" cy="25" r="2" fill="#3498db" />
            {/* Tie */}
            <path d="M45,50 L50,60 L55,50" fill="#e74c3c" />
            {/* Add animation for falling papers */}
            <style>
              {`
                @keyframes fall {
                  0% { transform: translateY(-50px); }
                  100% { transform: translateY(150px); }
                }
              `}
            </style>
          </svg>
        );
      default: // neutral
        return (
          <svg viewBox="0 0 100 150" style={businessmanStyles}>
            {backgroundElements}
            {/* Body */}
            <rect x="30" y="50" width="40" height="60" fill="#2c3e50" />
            {/* Head */}
            <circle cx="50" cy="40" r="20" fill="#f1c40f" />
            {/* Eyes */}
            <circle cx="40" cy="35" r="3" fill="#2c3e50" />
            <circle cx="60" cy="35" r="3" fill="#2c3e50" />
            {/* Neutral mouth */}
            <line x1="40" y1="45" x2="60" y2="45" stroke="#2c3e50" strokeWidth="2" />
            {/* Tie */}
            <path d="M45,50 L50,60 L55,50" fill="#e74c3c" />
          </svg>
        );
    }
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center',
      mb: 2,
      position: 'relative'
    }}>
      {getBusinessmanSVG()}
      <Box sx={{
        position: 'absolute',
        bottom: -30,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: '0.8rem',
        color: currentEmotion === 'dead' ? '#e74c3c' :
               currentEmotion === 'panicked' ? '#e74c3c' : 
               currentEmotion === 'worried' ? '#f39c12' : 
               currentEmotion === 'happy' ? '#2ecc71' : '#7f8c8d'
      }}>
        {currentEmotion === 'dead' && 'GAME OVER!'}
        {currentEmotion === 'panicked' && 'PANIC MODE!'}
        {currentEmotion === 'worried' && 'Getting worried...'}
        {currentEmotion === 'happy' && 'Business is good!'}
        {currentEmotion === 'neutral' && 'Business as usual'}
      </Box>
    </Box>
  );
};

export default PixelBusinessman; 