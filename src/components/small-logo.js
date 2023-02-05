import {useTheme} from '@mui/material/styles';

export const Logo = (width) => {
    const theme = useTheme();
    const fillColor = theme.palette.primary.main;
    return (
        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 160 55">
            <defs>
                <path
                    id="a"
                    d="M421.082 288.5h60.104v42.073h-60.104z"/>
                fill={fillColor}
            </defs>
            <path
                d="M-1522.47 1134.692h93.252V882.103h-181.075c0 80.686-45.015 122.108-132.609 122.108-87.67 0-132.635-41.426-132.636-122.11l-175.317.002v252.589h93.135v38.385h-93.134v738.734h175.317c0-80.686 44.98-121.973 132.635-121.973 87.59 0 132.609 41.293 132.61 121.975h181.074v-738.734h-93.251zm-254.495 38.373h-107.01v-38.385h107.01zm180.765 0h-106.93v-38.385h106.93z"
                style={{strokeWidth:3.21234}}
                transform="rotate(45 52.508 489.234) scale(.12846)"
                fill={fillColor}
            />
            <path
                d="M-1215.108 1423.442h95.66V1164.33h-185.75c0 82.77-46.178 125.26-136.034 125.26-89.934 0-136.06-42.495-136.06-125.263h-179.844v259.11h95.539v39.377h-95.539v757.808h179.844c0-82.769 46.142-125.122 136.06-125.122 89.852 0 136.033 42.36 136.033 125.125h185.751v-757.812h-95.659zm-261.066 39.364h-109.774v-39.377h109.774zm185.432 0h-109.691v-39.377h109.69z"
                style={{opacity:0.5, strokeWidth:3.30733, strokeDasharray:"none"}}
                transform="rotate(45 52.508 489.234) scale(.12846)"
                fill={fillColor}
            />
            <text xmlSpace="preserve"
                  x="175.104"
                  y="164.398"
                  style={{fontStyle:"italic", fontVariant:"normal", fontWeight: "normal", fontStretch: "normal", fontSize:"168.079px", fontFamily:"sans-serif", fill: "#000000", strokeWidth:2.62624}}
                  fill={fillColor}
            >
                <tspan x="175.104"
                       y="164.398"
                       style={{fontSize:"168.079px", strokeWidth :2.62624}}
                       fill={fillColor}
                >
                    Ticxz
                </tspan>
            </text>
        </svg>
    );
};