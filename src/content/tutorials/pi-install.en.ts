// Generated from the reviewed draft (sowel-site spec 005); edit the text here from now on.
import type { Article } from "../articles/types.ts";
import { withBase } from "../../lib/url.ts";

export const en: Article = {
  "lang": "en",
  "type": "tutorial",
  "path": "/en/tutorials/install-sowel-on-a-raspberry-pi/",
  "otherPath": "/fr/tutoriels/installer-sowel-sur-un-raspberry-pi/",
  "meta": {
    "title": "Install Sowel on a Raspberry Pi | Sowel",
    "description": "This tutorial starts from a brand new Raspberry Pi and ends when Sowel greets you in your browser. Allow about an hour, a good part of it spent waiting for downloads. You don't need to know Linux: every command can be copied as it is."
  },
  "datePublished": "2026-11-28",
  "title": "Install Sowel on a Raspberry Pi",
  "byline": "Marc Chachereau, creator of Sowel.",
  "duration": "about an hour",
  "blocks": [
    {
      "kind": "p",
      "runs": [
        {
          "text": "This tutorial starts from a brand new Raspberry Pi and ends when Sowel greets you in your browser. Allow about an hour, a good part of it spent waiting for downloads. You don't need to know Linux: every command can be copied as it is."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "What you need"
    },
    {
      "kind": "items",
      "ordered": false,
      "items": [
        [
          {
            "bold": "A Raspberry Pi 4 with at least 4 GB of memory"
          },
          {
            "text": ", or a Raspberry Pi 5. A Pi 3 is too tight for Sowel and its history database."
          }
        ],
        [
          {
            "bold": "Its official power supply."
          },
          {
            "text": " A weak supply causes random reboots that are hard to track down."
          }
        ],
        [
          {
            "bold": "A small SSD in a USB 3 enclosure"
          },
          {
            "text": ", see the tip below."
          }
        ],
        [
          {
            "bold": "An Ethernet cable"
          },
          {
            "text": " to your router, steadier than Wi-Fi for a device that runs day and night."
          }
        ],
        [
          {
            "bold": "A computer"
          },
          {
            "text": " on the same network, to prepare the disk and then control the Pi."
          }
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "An mSATA SSD rather than an SD card",
      "runs": [
        {
          "text": "Sowel records the history of the house all the time. An SD card copes badly with those writes and often gives up after a few months. Small mSATA SSDs, 64 or 128 GB, are cheap, new or refurbished. In an mSATA to USB 3 enclosure, they are far more reliable and faster than an SD card. Plug the enclosure into one of the Pi's blue USB ports: those are the USB 3 ones."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "1. Prepare the disk"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "The Pi will boot straight from the SSD, with no SD card. Install "
        },
        {
          "bold": "Raspberry Pi Imager"
        },
        {
          "text": " on your computer from raspberrypi.com/software, put the SSD in its enclosure and plug it in, then start Imager:"
        }
      ]
    },
    {
      "kind": "items",
      "ordered": true,
      "items": [
        [
          {
            "bold": "Device"
          },
          {
            "text": ": Raspberry Pi 4, or 5."
          }
        ],
        [
          {
            "bold": "Operating system"
          },
          {
            "text": ": Raspberry Pi OS (other), then "
          },
          {
            "bold": "Raspberry Pi OS Lite (64-bit)"
          },
          {
            "text": ". It is Debian without a desktop: the Pi will have no screen and no keyboard, you will control it from your computer."
          }
        ],
        [
          {
            "bold": "Storage"
          },
          {
            "text": ": your SSD."
          }
        ],
        [
          {
            "text": "When Imager offers to customise the installation, accept. Give the Pi the hostname "
          },
          {
            "code": "sowel"
          },
          {
            "text": ", choose a username and a password, set the "
          },
          {
            "bold": "time zone"
          },
          {
            "text": " to yours (Sowel uses it for its schedules), and turn on "
          },
          {
            "bold": "SSH"
          },
          {
            "text": " with password authentication."
          }
        ]
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Write the image. Then plug the SSD into a blue USB port on the Pi, then the Ethernet cable, and the power supply last."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Your Pi won't boot from the SSD?",
      "runs": [
        {
          "text": "Recent Raspberry Pi 4 boards boot from USB out of the box. An older one needs its bootloader updated once: in Imager, choose Misc utility images, then Bootloader, then USB Boot, write it to an SD card, boot the Pi from it for a minute, then remove the card."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "2. Connect to the Pi"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Give it a minute or two on first boot. Then open a terminal on your computer (Terminal on a Mac, PowerShell on Windows) and connect, replacing "
        },
        {
          "code": "marc"
        },
        {
          "text": " with the username you chose:"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "ssh marc@sowel.local"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Answer "
        },
        {
          "code": "yes"
        },
        {
          "text": " to the fingerprint question, then type your password. Check that the system is 64-bit:"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "uname -m",
      "output": "aarch64"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Finally, bring the system up to date. It takes a few minutes:"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "sudo apt update && sudo apt full-upgrade -y"
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "sowel.local doesn't answer?",
      "runs": [
        {
          "text": "Look for the Pi's IP address in your router's interface, among the connected devices, and use it instead: "
        },
        {
          "code": "ssh marc@192.168.1.42"
        },
        {
          "text": "."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "3. Install Docker"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Sowel runs in Docker, which keeps it apart from the rest of the system and makes updates simple. Install it, then give your user permission to use it:"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "curl -fsSL https://get.docker.com | sh\nsudo usermod -aG docker $USER"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Log out with "
        },
        {
          "code": "exit"
        },
        {
          "text": ", then connect again with the same "
        },
        {
          "code": "ssh"
        },
        {
          "text": " command. Without this, the new permission doesn't apply and the Sowel install fails. Check that Docker answers:"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "docker run --rm hello-world",
      "output": "Hello from Docker!\nThis message shows that your installation appears to be working correctly."
    },
    {
      "kind": "h2",
      "text": "4. Install Sowel"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "One command downloads Sowel and its history database, starts them and waits until they answer:"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "curl -fsSL https://raw.githubusercontent.com/mchacher/sowel/main/scripts/install.sh | sh",
      "output": "Detected timezone: Europe/London (set in docker-compose.yml)\nPulling images…\nStarting Sowel…\nWaiting for Sowel to be ready ✓\n\nSowel is running.\n\n  → http://192.168.1.42:3000"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "The first download takes a few minutes. Note the address shown at the end. Sowel starts again on its own when the Pi reboots: there is nothing else to set up."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "5. Create your account"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Open that address in your computer's browser. "
        },
        {
          "code": "http://sowel.local:3000"
        },
        {
          "text": " works too. Sowel asks you to create the administrator account:"
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t1-setup.webp"),
        "alt": "Sowel's first page: the administrator account.",
        "width": 1100,
        "height": 1420
      },
      "caption": "Sowel's first page: the administrator account."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Keep your password safe",
      "runs": [
        {
          "text": "Sowel uses no online service, so there is no email recovery. You can turn on two-factor authentication later, in your account settings."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "6. Set the house's location"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Sowel then asks for a name for the house and its location. The location is used to work out sunrise and sunset times, which recipes can use. Right-click your house in Google Maps to see its latitude and longitude."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t1-welcome.webp"),
        "alt": "The name of the house and its location.",
        "width": 992,
        "height": 960
      },
      "caption": "The name of the house and its location."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Click "
        },
        {
          "bold": "Continue"
        },
        {
          "text": ". Sowel restarts its engine for a few seconds and you land on the home page."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t1-home.webp"),
        "alt": "Sowel is installed. The house is still empty.",
        "width": 1600,
        "height": 1025
      },
      "caption": "Sowel is installed. The house is still empty."
    },
    {
      "kind": "h2",
      "text": "If it doesn't work"
    },
    {
      "kind": "items",
      "ordered": false,
      "items": [
        [
          {
            "bold": "\"cannot reach the Docker daemon\""
          },
          {
            "text": ": you did not reconnect after step 3. Type "
          },
          {
            "code": "exit"
          },
          {
            "text": ", connect again and run the install command once more."
          }
        ],
        [
          {
            "bold": "The page doesn't load"
          },
          {
            "text": ": see what Sowel says with "
          },
          {
            "code": "cd ~/sowel && docker compose logs -f"
          },
          {
            "text": ", and leave with Ctrl+C."
          }
        ],
        [
          {
            "bold": "The Pi reboots on its own"
          },
          {
            "text": ": it is nearly always the power supply. Use the official one."
          }
        ]
      ]
    },
    {
      "kind": "h2",
      "text": "What's next"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Sowel is running, but it knows no device yet. The next tutorial connects a Zigbee lamp and motion sensor, creates the first room and applies a recipe to it: "
        },
        {
          "link": "Turn the light on when you walk into a room",
          "href": withBase("/en/tutorials/turn-the-light-on-when-you-walk-into-a-room/")
        },
        {
          "text": "."
        }
      ]
    }
  ]
};
