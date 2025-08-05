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

  clear: () => {
    history.set([]);

    return '';
  },
  myip: async () => {
  try {
    const [ipRes, locationRes] = await Promise.all([
      fetch("https://wtfismyip.com/json"),
      fetch("https://we-are-jammin.xyz/json/")
    ]);

    const ipData = await ipRes.json();
    const locationData = await locationRes.json();

    return `
IP Address: ${ipData.YourFuckingIPAddress || 'N/A'}
Country: ${locationData.country || 'N/A'}
Region: ${locationData.regionName || 'N/A'}
City: ${locationData.city || 'N/A'}
ZIP Code: ${locationData.zip || 'N/A'}
Full Location: ${ipData.YourFuckingLocation || 'N/A'}
Latitude: ${locationData.lat || 'N/A'}
Longitude: ${locationData.lon || 'N/A'}
Timezone: ${locationData.timezone || 'N/A'}
Current Time: ${new Date().toLocaleString()}
ISP: ${locationData.isp || 'N/A'}
Organization: ${locationData.org || 'N/A'}
Autonomous System: ${locationData.as || 'N/A'}
Referrer: ${document.referrer || 'None'}
System Languages: ${navigator.languages.join(', ') || 'N/A'}
Screen Width: ${screen.width}px
Screen Height: ${screen.height}px
    `.trim();
  } catch (error) {
    return `Failed to fetch IP information. Reason: ${error}`;
  }
},

  email: () => {
    window.open(`mailto:${packageJson.author.email}`);

    return `Opening mailto:${packageJson.author.email}...`;
  },
  weather: async (args: string[]) => {
    const city = args.join('+');

    if (!city) {
      return 'Usage: weather [city]. Example: weather London';
    }

    const weather = await fetch(`https://wttr.in/${city}?ATm`);

    return weather.text();
  },
  exit: () => {
    return 'Please close the tab to exit.';
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
    const url = 'https://guns.lol/raydon'; // Replace with your target URL
    window.open(url, '_blank');
    return `Opening guns link: ${url}`;
  },
};



