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
                        lg: '0px',
                        md: '0px',
                        sm: '0px',
                        DEFAULT: '0px'
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
                        pride: {
                                red: '#FF3B30',
                                orange: '#FF9500',
                                yellow: '#FFCC00',
                                green: '#34C759',
                                blue: '#007AFF',
                                purple: '#AF52DE',
                                cyan: '#32ADE6',
                                pink: '#FF2D55'
                        },
                        cream: '#FFFCF0'
                },
                fontFamily: {
                        primary: ['Bebas Neue', 'sans-serif'],
                        secondary: ['Outfit', 'sans-serif'],
                        mono: ['JetBrains Mono', 'monospace']
                },
                boxShadow: {
                        'hard-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
                        'hard-md': '4px 4px 0px 0px rgba(0,0,0,1)',
                        'hard-lg': '6px 6px 0px 0px rgba(0,0,0,1)',
                        'hard-xl': '8px 8px 0px 0px rgba(0,0,0,1)'
                },
                keyframes: {
                        'accordion-down': {
                                from: {
                                        height: '0'
                                },
                                to: {
                                        height: 'var(--radix-accordion-content-height)'
                                }
                        },
                        'accordion-up': {
                                from: {
                                        height: 'var(--radix-accordion-content-height)'
                                },
                                to: {
                                        height: '0'
                                }
                        },
                        'ping-once': {
                                '0%': { transform: 'scale(1)', opacity: '1' },
                                '50%': { transform: 'scale(1.2)', opacity: '0.8' },
                                '100%': { transform: 'scale(1)', opacity: '1' }
                        }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'ping-once': 'ping-once 0.4s ease-out'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};