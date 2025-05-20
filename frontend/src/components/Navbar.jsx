import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
const navigate = useNavigate();
const token = localStorage.getItem('token');

const [open, setOpen] = useState(false);

const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
};

return (
    <div>
    <nav className="bg-[#302d41] text-[#cdd6f4] p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3 logo-container">
                {/* SVG Pakai Manual biar bisa ganti warna */}
            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className='h-12 w-12 fill-white'
                    width="500.000000pt" height="500.000000pt" viewBox="0 0 500.000000 500.000000"
                    preserveAspectRatio="xMidYMid meet">

                    <g transform="translate(0.000000,500.000000) scale(0.100000,-0.100000)"
                    stroke="none">
                    <path d="M2570 3698 c-33 -23 -57 -58 -29 -44 8 4 6 1 -3 -7 -15 -12 -18 -31
                    -18 -116 l0 -101 -314 0 c-282 0 -315 2 -327 17 -8 9 -9 14 -3 10 8 -5 12 18
                    13 78 3 134 -32 186 -112 171 -57 -11 -73 -46 -67 -151 7 -123 6 -125 -82
                    -126 -72 -2 -98 -4 -108 -8 -3 -2 -18 -5 -35 -7 -16 -3 -38 -12 -47 -21 -10
                    -9 -18 -13 -18 -10 0 6 -61 -31 -90 -56 -23 -18 -84 -99 -97 -127 -50 -111
                    -53 -150 -53 -785 1 -623 3 -665 48 -750 21 -40 50 -80 87 -119 29 -31 95 -78
                    95 -69 0 4 4 3 8 -2 9 -13 58 -36 92 -44 37 -9 1319 -7 1365 2 41 7 96 27 105
                    36 3 4 19 13 35 21 52 26 125 108 158 178 28 59 32 78 33 162 1 52 0 109 -3
                    126 l-5 32 -71 -75 c-72 -75 -87 -95 -91 -116 -14 -77 -63 -137 -138 -168 -16
                    -6 -26 -15 -23 -19 3 -4 -167 -9 -378 -10 -210 -1 -500 -5 -644 -9 -143 -3
                    -259 -3 -257 0 2 4 -15 10 -38 13 -23 4 -48 12 -55 18 -7 6 -13 8 -13 5 0 -4
                    -17 10 -39 31 -42 41 -84 105 -74 115 3 4 1 12 -5 19 -7 9 -10 207 -9 643 l2
                    630 24 56 c16 36 35 62 54 72 17 10 25 21 21 28 -4 8 -3 9 5 5 6 -4 19 -2 27
                    5 17 14 150 25 189 15 23 -6 25 -10 22 -53 -3 -36 1 -51 17 -68 50 -53 98 -54
                    142 -2 20 24 25 39 23 76 l-3 46 317 0 317 0 0 -45 c0 -25 6 -56 13 -70 16
                    -33 74 -48 115 -31 37 16 67 77 59 121 -7 34 -11 32 81 30 76 -2 117 -15 165
                    -55 35 -29 90 -131 84 -158 -2 -13 38 -15 111 -4 55 8 57 10 56 44 -1 36 -35
                    133 -47 133 -4 0 -6 4 -3 8 5 9 -15 37 -64 92 -27 30 -118 89 -147 95 -10 2
                    -30 8 -44 13 -14 6 -32 10 -40 10 -8 -1 -46 0 -85 0 l-72 2 -1 106 c-2 117
                    -13 153 -56 172 -35 16 -37 16 -75 -10z m-719 -581 c-10 -9 -11 -8 -5 6 3 10
                    9 15 12 12 3 -3 0 -11 -7 -18z m1334 -1216 c3 -5 2 -12 -3 -15 -5 -3 -9 1 -9
                    9 0 17 3 19 12 6z"/>
                    <path d="M3752 3030 c-12 -5 -37 -12 -55 -14 -45 -7 -89 -17 -107 -23 -8 -3
                    -22 -7 -30 -8 -65 -11 -97 -18 -118 -26 -13 -5 -28 -7 -33 -3 -5 3 -9 2 -9 -3
                    0 -4 -10 -8 -22 -9 -13 0 -43 -4 -68 -8 -25 -4 -57 -9 -71 -11 -15 -1 -35 -6
                    -47 -9 -11 -4 -36 -9 -56 -11 -41 -5 -91 -28 -102 -46 -4 -7 -9 -27 -11 -44
                    -2 -24 3 -39 23 -59 28 -27 51 -36 38 -13 -6 9 -4 9 7 1 20 -16 71 -24 89 -14
                    8 4 56 10 105 14 50 3 102 7 118 9 15 3 30 0 33 -5 7 -10 -652 -672 -678 -681
                    -12 -4 -50 28 -137 115 -67 66 -121 124 -121 129 0 5 -4 9 -8 9 -5 0 -55 47
                    -113 106 -122 123 -145 141 -188 149 -67 12 -97 -3 -189 -92 -48 -46 -107
                    -102 -131 -123 -24 -22 -41 -40 -38 -40 3 0 -6 -13 -21 -28 -15 -15 -30 -26
                    -34 -24 -5 2 -8 -3 -8 -11 0 -8 -7 -18 -16 -21 -8 -3 -12 -11 -8 -17 4 -7 3
                    -9 -3 -6 -10 6 -73 -56 -111 -110 -24 -35 -30 -100 -12 -133 13 -25 72 -36
                    108 -21 16 7 105 89 199 184 94 95 184 184 200 199 l28 27 98 -95 c57 -55 102
                    -92 109 -88 7 4 8 3 4 -4 -7 -12 62 -87 72 -77 8 8 31 -15 27 -28 -2 -7 16
                    -28 40 -47 24 -19 44 -38 44 -42 2 -14 36 -49 86 -87 37 -28 63 -40 98 -44 26
                    -2 47 -1 47 3 0 5 9 6 19 3 10 -3 32 3 47 13 35 22 465 446 459 453 -7 6 16
                    31 25 26 4 -2 67 56 140 130 73 74 136 135 140 135 11 0 17 -99 8 -108 -7 -7
                    -12 -43 -22 -151 -8 -78 30 -131 93 -131 70 0 92 26 106 125 3 17 9 50 14 75
                    4 25 9 65 10 89 1 25 5 49 8 54 5 8 15 77 29 187 3 25 8 56 11 70 3 14 7 57
                    10 95 4 61 2 74 -17 98 -23 29 -62 35 -108 17z"/>
                    <path d="M2440 2080 c0 -5 5 -10 11 -10 5 0 7 5 4 10 -3 6 -8 10 -11 10 -2 0
                    -4 -4 -4 -10z"/>
                    </g>
            </svg>
            <h1 className="text-2xl font-extrabold text-[#89b4fa] tracking-wide hover:text-[#cdd6f4] transition duration-300">
                Plan<span className="text-[#f38ba8]">IT</span>
            </h1>
            </div>

            {/* Navigation Links */}
            <div className='space-x-4 hidden sm:block'>    
                {
                    (token ? navLoggedIn : navLoggedOut).map(({to, text}) => {
                        return (
                            <NavItem to={to} text={text}/>
                        )
                    })
                    
                }
                {token && <button onClick={handleLogout} className="hover:underline hover:text-[#89b4fa] transition duration-300 ">Logout</button>}
            </div>
            
            <button className='sm:hidden h-8 w-8 align-middle text-center block' onClick={() => {setOpen(!open)}}>
                <svg className="fill-white h-6 w-6 -translate-x-3 -translate-y-1" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24.75 24.75" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M0,3.875c0-1.104,0.896-2,2-2h20.75c1.104,0,2,0.896,2,2s-0.896,2-2,2H2C0.896,5.875,0,4.979,0,3.875z M22.75,10.375H2 c-1.104,0-2,0.896-2,2c0,1.104,0.896,2,2,2h20.75c1.104,0,2-0.896,2-2C24.75,11.271,23.855,10.375,22.75,10.375z M22.75,18.875H2 c-1.104,0-2,0.896-2,2s0.896,2,2,2h20.75c1.104,0,2-0.896,2-2S23.855,18.875,22.75,18.875z"></path> </g> </g></svg>
            </button>
        </div>
    </nav>
            {open && (
                <div className="sm:hidden flex flex-col space-y-2 bg-[#302d41] p-2 text-center">
                    {(token ? navLoggedIn : navLoggedOut).map(({to, text}) => (
                        <NavItem key={to} to={to} text={text} />
                    ))}
                    {token && (
                        <button
                            onClick={handleLogout}
                            className="hover:underline hover:text-[#89b4fa] transition duration-300 text-center"
                        >
                            Logout
                        </button>
                    )}
                </div>
            )}
            </div>
);
}

const navLoggedIn = [
    {
        to: "/",
        text: "Home"
    },
    {
        to: "/friends",
        text: "Friends"
    },
    {
        to: "/schedules",
        text: "Schedules"
    },
]

const navLoggedOut = [
    {
        to: "/login",
        text: "Home"
    },
    {
        to: "/register",
        text: "Register"
    },
]

function NavItem({ to, text }) {
    return (
        <Link to={to} className='hover:text-[#89b4fa] transition duration-300 border-black border-spacing-1'>{ text }</Link>
    )
}

export default Navbar;
