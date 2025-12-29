/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                morandi: {
                    bg: "#F0F4F8", // Cleaner cool gray/white
                    card: "#FFFFFF",
                    text: "#1A1A1A", // Darker black for contrast
                    muted: "#64748B", // Slate 500
                    1: "#FF6B6B", // Vibrant Red
                    2: "#4ECDC4", // Vibrant Teal
                    3: "#45B7D1", // Vibrant Blue
                    4: "#96CEB4", // Vibrant Green
                    5: "#FFEEAD", // Vibrant Yellow
                    6: "#D4A5A5", // Soft Pink
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                }
            }
        },
    },
    plugins: [],
}
