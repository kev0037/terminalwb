import packageJson from '../../package.json';
import themes from '../../themes.json';
import { history } from '../stores/history';
import { theme } from '../stores/theme';

const hostname = window.location.hostname;

export const commands: Record<string, (args: string[]) => Promise<string> | string> = {
  help: () => 'Available commands: ' + Object.keys(commands).join(', '),
  hostname: () => hostname,
  date: () => new Date().toLocaleString(),
  sudo: (args: string[]) => {
    window.open('https://youtu.be/xvFZjo5PgG0?si=X5j3OTy0rpziszZo');
    return 'get rickrolled in 2025 dumbass';
  },

  theme: (args: string[]) => {
    const usage = `Usage: theme [args].
  [args]:
    ls: list all available themes
    set: set theme to [theme]

  [Examples]:
    theme ls
    theme set gruvboxdark
  `;

    if (args.length === 0) {
      return usage;
    }

    switch (args[0]) {
      case 'ls': {
        return "Here are the themes available: " + themes.map((t) => t.name.toLowerCase()).join(', ');
      }

      case 'set': {
        if (args.length !== 2) {
          return usage;
        }

        const selectedTheme = args[1];
        const t = themes.find((t) => t.name.toLowerCase() === selectedTheme);

        if (!t) {
          return `Theme '${selectedTheme}' not found. Try 'theme ls' to see all available themes.`;
        }

        theme.set(t);

        return `Theme set to ${selectedTheme}`;
      }

      default: {
        return usage;
      }
    }
  },
  dnslookup: async (args: string[]) => {
  if (args.length === 0) return 'Usage: dnslookup [domain]';

  const domain = args[0];

  try {
    const res = await fetch(`https://dns.google/resolve?name=${domain}&type=A`);
    if (!res.ok) return `Failed to fetch DNS data. Status: ${res.status}`;

    const data = await res.json();

    if (!data.Answer) return `No DNS records found for ${domain}`;

    const records = data.Answer.map((a: any) => a.data).join(', ');

    return `A records for ${domain}: ${records}`;
  } catch (e) {
    return `Error fetching DNS records: ${e}`;
  }
},

  define: async (args: string[]) => {
    if (args.length === 0) return "Usage: define [word]";

    const word = args[0].toLowerCase();

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      if (!response.ok) return `No definition found for '${word}'.`;

      const data = await response.json();

      // Grab first meaning, first definition
      const meaning = data[0]?.meanings?.[0];
      const definition = meaning?.definitions?.[0]?.definition;

      if (!definition) return `No definition found for '${word}'.`;

      return `${word}: ${definition}`;
    } catch (err) {
      return `Error fetching definition: ${err}`;
    }
  },
  numberlookup: async (args: string[]) => {
  const number = args.join('').trim();

  if (!number) {
    return `Usage: numberlookup [mobile_number]
Example: numberlookup +447911123456`;
  }

  const apiKey = '9CB1CD58887143B5ACBA63A612ECB4EF'; 

  try {
    const res = await fetch(`https://api.veriphone.io/v2/verify?phone=${encodeURIComponent(number)}&key=${apiKey}`);
    if (!res.ok) return `Failed to fetch number details. HTTP Error: ${res.status}`;

    const data = await res.json();

    if (!data.phone_valid) {
      return `The phone number '${number}' is invalid or not found.`;
    }

    return `
Number      : ${data.phone || number}
Country     : ${data.country || 'Unknown'}
Carrier     : ${data.carrier || 'Unknown'}
Line Type   : ${data.phone_type || 'Unknown'}
Valid       : ${data.phone_valid ? 'Yes' : 'No'}`;
  } catch (error) {
    return `Error during number lookup: ${error}`;
  }
},

  joke: async () => {
    try {
      const response = await fetch('https://official-joke-api.appspot.com/jokes/random');
      if (!response.ok) return "Failed to fetch a joke.";

      const joke = await response.json();
      return `${joke.setup}\n${joke.punchline}`;
    } catch (err) {
      return `Error fetching joke: ${err}`;
    }
  },

  clear: () => {
    history.set([]);

    return '';
  },

  rps: (args: string[]) => {
    const choices = ['rock', 'paper', 'scissors'];
    if (args.length === 0) return 'Usage: rps [rock|paper|scissors]';
    const userChoice = args[0].toLowerCase();
    if (!choices.includes(userChoice)) return 'Invalid choice! Use rock, paper or scissors.';
    const botChoice = choices[Math.floor(Math.random() * 3)];
    if (userChoice === botChoice) return `It's a tie! We both chose ${botChoice}.`;
    if (
      (userChoice === 'rock' && botChoice === 'scissors') ||
      (userChoice === 'paper' && botChoice === 'rock') ||
      (userChoice === 'scissors' && botChoice === 'paper')
    ) return `You win! Your ${userChoice} beats my ${botChoice}.`;
    return `You lose! My ${botChoice} beats your ${userChoice}.`;
  },
  aibot: () => {
    const url = 'https://www.kevai.site'; 
    window.open(url, '_blank');
    return `Opening: ${url}`;
  },

  myip: async () => {
    try {
      const res = await fetch("https://ipapi.co/json/");
      const data = await res.json();

      return `
IP Address: ${data.ip}
Country: ${data.country_name}
Region: ${data.region}
City: ${data.city}
ZIP Code: ${data.postal}
Latitude: ${data.latitude}
Longitude: ${data.longitude}
Timezone: ${data.timezone}
Current Time: ${new Date().toLocaleString()}
ISP: ${data.org}
Organization: ${data.org}
Referrer: ${document.referrer || 'None'}
System Languages: ${navigator.languages.join(', ')}
Screen Width: ${screen.width}px
Screen Height: ${screen.height}px
      `.trim();
    } catch (err) {
      return `Failed to fetch IP information. Reason: ${err}`;
    }
  },

  email: () => {
    window.open(`mailto:${packageJson.author.email}`);

    return `Opening mailto:${packageJson.author.email}...`;
  },

  weather: async (args: string[]) => {
    const city = args.join(' ');
    if (!city) {
      return 'Usage: weather [city]. Example: weather London';
    }

    try {
      // Geocoding city name to lat/lon using Nominatim API (OpenStreetMap)
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`
      );
      if (!geoRes.ok) return `Failed to fetch location data: ${geoRes.statusText}`;
      const geoData = await geoRes.json();

      if (!geoData.length) {
        return `Location '${city}' not found.`;
      }

      const { lat, lon, display_name } = geoData[0];

      // Fetch weather from Open-Meteo
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
      );
      if (!weatherRes.ok) return `Failed to fetch weather data: ${weatherRes.statusText}`;
      const weatherData = await weatherRes.json();

      if (!weatherData.current_weather) {
        return 'No current weather data available.';
      }

      const cw = weatherData.current_weather;
      return `Weather for ${display_name}:
Temperature: ${cw.temperature}°C
Wind Speed: ${cw.windspeed} km/h
Wind Direction: ${cw.winddirection}°`;
    } catch (error) {
      return `Error fetching weather info: ${error}`;
    }
  },

  banner: () => `

██████╗  █████╗ ██╗   ██╗██████╗  ██████╗ ███╗   ██╗
██╔══██╗██╔══██╗╚██╗ ██╔╝██╔══██╗██╔═══██╗████╗  ██║
██████╔╝███████║ ╚████╔╝ ██║  ██║██║   ██║██╔██╗ ██║
██╔══██╗██╔══██║  ╚██╔╝  ██║  ██║██║   ██║██║╚██╗██║
██║  ██║██║  ██║   ██║   ██████╔╝╚██████╔╝██║ ╚████║
╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝
                                                    
Type 'help' to see list of available commands.
`,

  guns: () => {
    const url = 'https://guns.lol/raydon'; 
    window.open(url, '_blank');
    return `Opening guns link: ${url}`;
  },

  // New calendar command added below
  cal: (args: string[]) => {
    const monthNames = [
      "January", "February", "March", "April", "May",
      "June", "July", "August", "September",
      "October", "November", "December"
    ];

    // Pad string on left with spaces to length n
    function stringPad(str: string, n: number) {
      return str.length >= n ? str : " ".repeat(n - str.length) + str;
    }

    // Get real day index (Monday=0, Sunday=6)
    function getRealDay(date: Date) {
      return date.getDay() === 0 ? 6 : date.getDay() - 1;
    }

    let chosenMonth: number | null = null;
    let chosenYear: number | null = null;
    for (const arg of args) {
      const a = arg.toLowerCase();
      const mIndex = monthNames.findIndex(m => m.toLowerCase().startsWith(a));
      if (mIndex !== -1) {
        chosenMonth = mIndex;
        continue;
      }
      if (/^\d{1,4}$/.test(arg)) {
        const num = parseInt(arg);
        if (num > 31) chosenYear = num;
        else if (num >= 1 && num <= 12) chosenMonth = num - 1;
      } else if (/^\d{1,2}\.\d{1,4}$/.test(arg)) {
        const [m, y] = arg.split(".");
        chosenMonth = parseInt(m) - 1;
        chosenYear = parseInt(y);
      } else if (/^\d{1,4}\.\d{1,2}$/.test(arg)) {
        const [y, m] = arg.split(".");
        chosenYear = parseInt(y);
        chosenMonth = parseInt(m) - 1;
      }
    }

    const today = new Date();
    if (chosenYear === null) chosenYear = today.getFullYear();
    if (chosenMonth === null) chosenMonth = today.getMonth();

    const firstDay = new Date(chosenYear, chosenMonth, 1);
    const lastDay = new Date(chosenYear, chosenMonth + 1, 0);
    const lastDate = lastDay.getDate();
    const firstWeekDay = getRealDay(firstDay);

    let output = `    ${monthNames[chosenMonth]} ${chosenYear}\nMo Tu We Th Fr Sa Su\n`;

    let day = 1;
    for (let i = 0; i < 42; i++) {
      if (i < firstWeekDay || day > lastDate) {
        output += "   ";
      } else {
        let dayStr = day.toString();
        if (day === today.getDate() && chosenMonth === today.getMonth() && chosenYear === today.getFullYear()) {
          dayStr = `[${dayStr}]`; // Highlight today
        }
        output += stringPad(dayStr, 2) + " ";
        day++;
      }
      if ((i + 1) % 7 === 0) output += "\n";
    }

    return output.trim();
  },
};





