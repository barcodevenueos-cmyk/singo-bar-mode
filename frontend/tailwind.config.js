/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                borderRadius: {
                        lg: '8px',
                        md: '6px',
                        sm: '4px',
                        DEFAULT: '6px'
                },
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: {
                                DEFAULT: 'hsl(var(--card))',
                                foreground: 'hsl(var(--card-foreground))'
                        },
                        popover: {
                                DEFAULT: 'hsl(var(--popover))',
                                foreground: 'hsl(var(--popover-foreground))'
                        },
                        primary: {
                                DEFAULT: 'hsl(var(--primary))',
                                foreground: 'hsl(var(--primary-foreground))'
                        },
                        secondary: {
                                DEFAULT: 'hsl(var(--secondary))',
                                foreground: 'hsl(var(--secondary-foreground))'
                        },
                        muted: {
                                DEFAULT: 'hsl(var(--muted))',
                                foreground: 'hsl(var(--muted-foreground))'
                        },
                        accent: {
                                DEFAULT: 'hsl(var(--accent))',
                                foreground: 'hsl(var(--accent-foreground))'
                        },
                        destructive: {
                                DEFAULT: 'hsl(var(--destructive))',
                                foreground: 'hsl(var(--destructive-foreground))'
                        },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        },
                        neon: {
                                pink: '#FF10F0',
                                purple: '#9D00FF',
                                cyan: '#00F0FF',
                                blue: '#4169E1',
                                silver: '#C0C0C0'
                        },
                        dark: {
                                bg: '#0A0A0A',
                                card: '#1A1A2E',
                                surface: '#16213E'
                        }
                },
                fontFamily: {
                        primary: ['Orbitron', 'sans-serif'],
                        secondary: ['Rajdhani', 'sans-serif'],
                        mono: ['Share Tech Mono', 'monospace']
                },
                boxShadow: {
                        'neon-pink': '0 0 10px #FF10F0, 0 0 20px #FF10F0, 0 0 30px #FF10F0',
                        'neon-purple': '0 0 10px #9D00FF, 0 0 20px #9D00FF, 0 0 30px #9D00FF',
                        'neon-cyan': '0 0 10px #00F0FF, 0 0 20px #00F0FF, 0 0 30px #00F0FF',
                        'neon-silver': '0 0 10px #C0C0C0, 0 0 20px #C0C0C0'
                },
                textShadow: {
                        'neon': '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor'
                },
                keyframes: {
                        'accordion-down': {
                                from: { height: '0' },
                                to: { height: 'var(--radix-accordion-content-height)' }
                        },
                        'accordion-up': {
                                from: { height: 'var(--radix-accordion-content-height)' },
                                to: { height: '0' }
                        },
                        'float': {
                                '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
                                '50%': { transform: 'translateY(-20px) rotate(10deg)' }
                        },
                        'glow-pulse': {
                                '0%, 100%': { opacity: '1' },
                                '50%': { opacity: '0.5' }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'float': 'float 3s ease-in-out infinite',
                        'glow-pulse': 'glow-pulse 2s ease-in-out infinite'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};