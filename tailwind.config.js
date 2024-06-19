/** @type {import('tailwindcss').Config} */

// eslint-disable-next-line @typescript-eslint/no-var-requires, no-undef
const colors = require("tailwindcss/colors");

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        colors: {
            transparent: colors.transparent,
            black: colors.black,
            white: colors.white,
            gray: colors.gray,
            blue: colors.blue,
            components: {
                background: "#503197",
                button: "#BF53C9",
                buttonHover: "#E17CB7",
                nav: "#18215D",
                sidenav: "#F6E0C8",
                board: "#EFAAA5",
            },
        },
        extend: {},
    },
    plugins: [],
};
