// Generated from the reviewed draft (sowel-site spec 005); edit the text here from now on.
import type { Article } from "../articles/types.ts";
import { withBase } from "../../lib/url.ts";

export const en: Article = {
  "lang": "en",
  "type": "tutorial",
  "path": "/en/tutorials/turn-the-light-on-when-you-walk-into-a-room/",
  "otherPath": "/fr/tutoriels/allumer-la-lumiere-quand-on-entre-dans-une-piece/",
  "meta": {
    "title": "Turn the light on when you walk into a room | Sowel",
    "description": "It's the first automation everyone wants: the light comes on when you walk into the living room and goes off when you leave. With Sowel there is no rule to write. You describe the room and what it holds, then apply a recipe to it. Allow an hour if you start from scratch on the Zigbee side, twenty minutes or so otherwise."
  },
  "datePublished": "2026-11-28",
  "title": "Turn the light on when you walk into a room",
  "byline": "Marc Chachereau, creator of Sowel.",
  "duration": "about an hour",
  "blocks": [
    {
      "kind": "p",
      "runs": [
        {
          "text": "It's the first automation everyone wants: the light comes on when you walk into the living room and goes off when you leave. With Sowel there is no rule to write. You describe the room and what it holds, then apply a recipe to it. Allow an hour if you start from scratch on the Zigbee side, twenty minutes or so otherwise."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "Before you start"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "This tutorial assumes Sowel is installed, for example by following "
        },
        {
          "link": "Install Sowel on a Raspberry Pi",
          "href": withBase("/en/tutorials/install-sowel-on-a-raspberry-pi/")
        },
        {
          "text": ". Sowel doesn't talk to Zigbee devices directly: it goes through "
        },
        {
          "bold": "Zigbee2MQTT"
        },
        {
          "text": ", free software that drives the radio dongle and publishes the state of each device on an "
        },
        {
          "bold": "MQTT broker"
        },
        {
          "text": ". You set this up once for the whole house."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "The Zigbee hardware"
    },
    {
      "kind": "items",
      "ordered": false,
      "items": [
        [
          {
            "bold": "A USB Zigbee dongle"
          },
          {
            "text": ", the coordinator of the network. The SONOFF ZBDongle-E is cheap and very well supported by Zigbee2MQTT. The Supported Adapters page on zigbee2mqtt.io lists the other recommended models."
          }
        ],
        [
          {
            "bold": "A USB extension cable"
          },
          {
            "text": " about a metre long, see the tip below."
          }
        ],
        [
          {
            "bold": "A dimmable lamp and a Zigbee motion sensor."
          },
          {
            "text": " This tutorial uses a Philips Hue bulb and an Aqara sensor, which also measures light level. Before buying, check that a device is in the Supported Devices list on zigbee2mqtt.io: it holds thousands of them."
          }
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Keep the dongle away from the Pi",
      "runs": [
        {
          "text": "USB 3 ports and SSDs disturb the Zigbee radio, which shares its band with Wi-Fi. Plug the dongle into a black USB port, at the end of the extension cable, away from the Pi and its disk. It is the most common cause of a flaky Zigbee network."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "Install the MQTT broker"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "The broker is the mailbox between Zigbee2MQTT and Sowel. Install Mosquitto on the Pi:"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "sudo apt install -y mosquitto mosquitto-clients"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Out of the box, it only listens to the Pi itself. Open it to the local network, so that Sowel can reach it from Docker:"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "printf 'listener 1883 0.0.0.0\\nallow_anonymous true\\n' | sudo tee /etc/mosquitto/conf.d/sowel.conf\nsudo systemctl restart mosquitto"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "What about security?",
      "runs": [
        {
          "text": "Without a password, any device on your local network can read from and write to the broker. That is acceptable at home, behind your router, as long as port 1883 is not open to the internet. The "
        },
        {
          "link": "Preparing the Host",
          "href": "https://docs.sowel.org/user/host-setup/"
        },
        {
          "text": " page of the manual explains how to add a password."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "Install Zigbee2MQTT"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Zigbee2MQTT runs in Docker, like Sowel. It needs to be told three things: where the dongle is, what type it is, and where to reach the broker. Take these steps in order: each one sets up the next."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "bold": "Find the dongle."
        },
        {
          "text": " Plug it in, then ask the Pi for its list of serial devices:"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "ls /dev/serial/by-id/",
      "output": "usb-ITEAD_SONOFF_Zigbee_3.0_USB_Dongle_Plus_V2_20240122184111-if00"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "The line shown is the full name of your dongle. Unlike "
        },
        {
          "code": "ttyUSB0"
        },
        {
          "text": " or "
        },
        {
          "code": "ttyACM0"
        },
        {
          "text": ", it does not change from one reboot to the next. Write it down, or keep the terminal open to copy it. If nothing shows, unplug the dongle, plug it back in and run the command again."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "bold": "Create the configuration file."
        },
        {
          "text": " Make a folder for Zigbee2MQTT and open a new file:"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "mkdir -p ~/zigbee2mqtt && cd ~/zigbee2mqtt\nnano compose.yml"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Paste in the content below. On the last line, replace "
        },
        {
          "code": "YOUR-DONGLE"
        },
        {
          "text": " with the name shown in the previous step, without touching the part after the colon. Change the "
        },
        {
          "code": "TZ"
        },
        {
          "text": " line to your time zone if needed. Save with "
        },
        {
          "bold": "Ctrl+O"
        },
        {
          "text": " then "
        },
        {
          "bold": "Enter"
        },
        {
          "text": ", and leave with "
        },
        {
          "bold": "Ctrl+X"
        },
        {
          "text": "."
        }
      ]
    },
    {
      "kind": "file",
      "name": "compose.yml",
      "content": "services:\n  zigbee2mqtt:\n    image: ghcr.io/koenkk/zigbee2mqtt\n    container_name: zigbee2mqtt\n    restart: unless-stopped\n    ports:\n      - 8080:8080\n    environment:\n      - TZ=Europe/London\n    volumes:\n      - ./data:/app/data\n      - /run/udev:/run/udev:ro\n    extra_hosts:\n      - host.docker.internal:host-gateway\n    devices:\n      - /dev/serial/by-id/YOUR-DONGLE:/dev/ttyACM0"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Why two paths on the last line?",
      "runs": [
        {
          "text": "Zigbee2MQTT lives in a container, which can't see the Pi's files. The "
        },
        {
          "code": "devices"
        },
        {
          "text": " line lends it the dongle: left of the colon, the path on the Pi; right of it, the name the container sees it under. That name is set to "
        },
        {
          "code": "/dev/ttyACM0"
        },
        {
          "text": " whatever your dongle. It is that name, and only that one, that you give Zigbee2MQTT."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "bold": "Start Zigbee2MQTT:"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "docker compose up -d"
    },
    {
      "kind": "p",
      "runs": [
        {
          "bold": "Answer the setup wizard's three questions."
        },
        {
          "text": " Open "
        },
        {
          "code": "http://sowel.local:8080"
        },
        {
          "text": " in your browser. On first start, Zigbee2MQTT shows a setup wizard. Three answers matter:"
        }
      ]
    },
    {
      "kind": "items",
      "ordered": false,
      "items": [
        [
          {
            "bold": "The dongle's port"
          },
          {
            "text": ": "
          },
          {
            "code": "/dev/ttyACM0"
          },
          {
            "text": ", the name the container sees. Not the long "
          },
          {
            "code": "/dev/serial/by-id/…"
          },
          {
            "text": " path: the container doesn't know it, and Zigbee2MQTT would not find the dongle."
          }
        ],
        [
          {
            "bold": "The adapter type"
          },
          {
            "text": ": it depends on your dongle, see the table below."
          }
        ],
        [
          {
            "bold": "The MQTT server"
          },
          {
            "text": ": "
          },
          {
            "code": "mqtt://host.docker.internal:1883"
          },
          {
            "text": ", which means the Pi, thanks to the file's "
          },
          {
            "code": "extra_hosts"
          },
          {
            "text": " line. Not "
          },
          {
            "code": "localhost"
          },
          {
            "text": ": inside the container, "
          },
          {
            "code": "localhost"
          },
          {
            "text": " means the container itself, where no broker runs."
          }
        ]
      ]
    },
    {
      "kind": "table",
      "head": [
        "Your dongle",
        "Adapter type"
      ],
      "rows": [
        [
          [
            {
              "text": "SONOFF ZBDongle-E, Home Assistant Connect ZBT-1 (formerly SkyConnect)"
            }
          ],
          [
            {
              "code": "ember"
            }
          ]
        ],
        [
          [
            {
              "text": "SONOFF ZBDongle-P"
            }
          ],
          [
            {
              "code": "zstack"
            }
          ]
        ],
        [
          [
            {
              "text": "ConBee II, ConBee III"
            }
          ],
          [
            {
              "code": "deconz"
            }
          ]
        ]
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Your model isn't in the table? The Supported Adapters page on zigbee2mqtt.io gives the type of each one. Leave the wizard's other settings at their defaults, the "
        },
        {
          "code": "zigbee2mqtt"
        },
        {
          "text": " topic in particular, which Sowel expects. If Zigbee2MQTT won't start with "
        },
        {
          "code": "ember"
        },
        {
          "text": ", the dongle's firmware is too old: the same page explains how to update it."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Once the wizard is done, Zigbee2MQTT restarts and shows an empty device list. The dongle and the broker are ready."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "Pair the lamp and the sensor"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "In the Zigbee2MQTT interface, click "
        },
        {
          "bold": "Permit join"
        },
        {
          "text": " to let new devices in, then put each one in pairing mode as its manual says. A new Hue bulb pairs the first time it is powered on. For the Aqara sensor, hold its small button down for a few seconds, until the blue light blinks."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Then give them a short name in Zigbee2MQTT. In this tutorial, they are "
        },
        {
          "code": "bulb_01"
        },
        {
          "text": " and "
        },
        {
          "code": "motion_01"
        },
        {
          "text": ". When both show in Zigbee2MQTT's list, the Zigbee side is ready."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "From here, the path in Sowel is always the same: "
        },
        {
          "bold": "devices"
        },
        {
          "text": " come from the network, you turn them into "
        },
        {
          "bold": "equipments"
        },
        {
          "text": ", placed in a "
        },
        {
          "bold": "room"
        },
        {
          "text": ", and a "
        },
        {
          "bold": "recipe"
        },
        {
          "text": " looks after the room."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "1. Connect Zigbee2MQTT"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Open "
        },
        {
          "bold": "Administration"
        },
        {
          "text": ", then "
        },
        {
          "bold": "Plugins"
        },
        {
          "text": ". In the "
        },
        {
          "bold": "Store"
        },
        {
          "text": " tab, search for \"zigbee\" and click "
        },
        {
          "bold": "Install"
        },
        {
          "text": "."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-catalogue.webp"),
        "alt": "The Zigbee2MQTT plugin in the store.",
        "width": 1500,
        "height": 670
      },
      "caption": "The Zigbee2MQTT plugin in the store."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Then open "
        },
        {
          "bold": "Administration"
        },
        {
          "text": ", "
        },
        {
          "bold": "Integrations"
        },
        {
          "text": ", then "
        },
        {
          "bold": "Zigbee2MQTT"
        },
        {
          "text": ". The broker address is already filled in with "
        },
        {
          "code": "mqtt://host.docker.internal:1883"
        },
        {
          "text": ", which means the Pi itself. If your broker runs elsewhere, replace it with its address. Click "
        },
        {
          "bold": "Save"
        },
        {
          "text": ", then "
        },
        {
          "bold": "Start"
        },
        {
          "text": "."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-z2m.webp"),
        "alt": "The settings of the Zigbee2MQTT integration.",
        "width": 965,
        "height": 1800
      },
      "caption": "The settings of the Zigbee2MQTT integration."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "After a few seconds, the status turns to "
        },
        {
          "bold": "Connected"
        },
        {
          "text": ". Open "
        },
        {
          "bold": "Administration"
        },
        {
          "text": ", "
        },
        {
          "bold": "Devices"
        },
        {
          "text": ": the lamp and the sensor are there, with their make and model. Sowel found them on its own."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-devices.webp"),
        "alt": "The two devices discovered from Zigbee2MQTT.",
        "width": 1600,
        "height": 706
      },
      "caption": "The two devices discovered from Zigbee2MQTT."
    },
    {
      "kind": "h2",
      "text": "2. Create the room"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Open "
        },
        {
          "bold": "Administration"
        },
        {
          "text": ", "
        },
        {
          "bold": "Home Topology"
        },
        {
          "text": ", then "
        },
        {
          "bold": "Add zone"
        },
        {
          "text": ". Call it \"Living room\" and choose "
        },
        {
          "bold": "Home"
        },
        {
          "text": " as the parent zone."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-zone.webp"),
        "alt": "The living room, placed in the house.",
        "width": 935,
        "height": 815
      },
      "caption": "The living room, placed in the house."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "You can add floors later and place your rooms in them: for each level, Sowel works out presence, temperature or how many lights are on."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "3. Create the equipments"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "A device is what's on the network: "
        },
        {
          "code": "bulb_01"
        },
        {
          "text": ", "
        },
        {
          "code": "motion_01"
        },
        {
          "text": ". An equipment is what's in the room and what you recognise: the ceiling light, the sensor. Sowel reasons with equipments."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Open "
        },
        {
          "bold": "Administration"
        },
        {
          "text": ", "
        },
        {
          "bold": "Equipments"
        },
        {
          "text": ", then "
        },
        {
          "bold": "Add equipment"
        },
        {
          "text": ". Choose the type "
        },
        {
          "bold": "Light (Dimmable)"
        },
        {
          "text": ", call it \"Ceiling light\" and place it in the living room."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-equip-a.webp"),
        "alt": "The type, name and room of the equipment.",
        "width": 1095,
        "height": 831
      },
      "caption": "The type, name and room of the equipment."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Click "
        },
        {
          "bold": "Next"
        },
        {
          "text": ". Sowel only offers the devices that suit a dimmable light: tick the bulb, then click "
        },
        {
          "bold": "Create"
        },
        {
          "text": "."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-equip-b.webp"),
        "alt": "Only compatible devices are offered.",
        "width": 1095,
        "height": 699
      },
      "caption": "Only compatible devices are offered."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Do the same for the sensor, with the type "
        },
        {
          "bold": "Sensor"
        },
        {
          "text": ", the name \"Sensor\" and the device "
        },
        {
          "code": "motion_01"
        },
        {
          "text": ". Both equipments show under the living room, and the sensor already reports the room's light level."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-equipments.webp"),
        "alt": "The ceiling light and the sensor, in the living room.",
        "width": 1600,
        "height": 345
      },
      "caption": "The ceiling light and the sensor, in the living room."
    },
    {
      "kind": "h2",
      "text": "4. Apply the recipe"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Go back to "
        },
        {
          "bold": "Plugins"
        },
        {
          "text": ", "
        },
        {
          "bold": "Store"
        },
        {
          "text": " tab, and install the recipe "
        },
        {
          "bold": "Motion Light (Dimmable)"
        },
        {
          "text": ". Then open "
        },
        {
          "bold": "Home"
        },
        {
          "text": ", then "
        },
        {
          "bold": "Living room"
        },
        {
          "text": ". In the "
        },
        {
          "bold": "Behaviors"
        },
        {
          "text": " column, click the "
        },
        {
          "bold": "+"
        },
        {
          "text": " next to "
        },
        {
          "bold": "Recipes"
        },
        {
          "text": " and choose the recipe."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "It asks a few questions:"
        }
      ]
    },
    {
      "kind": "items",
      "ordered": false,
      "items": [
        [
          {
            "bold": "Lights"
          },
          {
            "text": ": the ceiling light."
          }
        ],
        [
          {
            "bold": "Timeout"
          },
          {
            "text": ": 5 minutes with no motion before turning off."
          }
        ],
        [
          {
            "bold": "Brightness"
          },
          {
            "text": ": 254, which is full power. The scale runs from 1 to 254."
          }
        ],
        [
          {
            "bold": "Lux Threshold"
          },
          {
            "text": ": 30. Above it, the room is bright enough and the light stays off."
          }
        ],
        [
          {
            "bold": "Slot 1"
          },
          {
            "text": ": from 22:00 to 07:00, brightness 40. At night, a soft light is enough."
          }
        ]
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-recipe.webp"),
        "alt": "The recipe, set up for the living room.",
        "width": 800,
        "height": 1840
      },
      "caption": "The recipe, set up for the living room."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Click "
        },
        {
          "bold": "Create"
        },
        {
          "text": ". The recipe runs straight away."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "The recipe doesn't know the sensor",
      "runs": [
        {
          "text": "You never told it about the sensor. It reads the presence and light level that Sowel works out for the living room. If you add a second sensor to the room, it takes it into account with no setting at all."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "5. Test it"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Walk past the sensor. The room turns to "
        },
        {
          "bold": "Motion"
        },
        {
          "text": ", the ceiling light comes on, and the activity log, on the right, shows what happened and why. Five minutes after the last movement, the light goes off."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-room-on.webp"),
        "alt": "The living room as someone walks in.",
        "width": 1600,
        "height": 1125
      },
      "caption": "The living room as someone walks in."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "A switch on the recipe's card pauses it, for a film night for example."
        }
      ]
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
            "bold": "The integration stays disconnected"
          },
          {
            "text": ": check the broker address. If Mosquitto runs on the Pi, it must listen on the network and not only locally, see "
          },
          {
            "link": "Preparing the Host",
            "href": "https://docs.sowel.org/user/host-setup/"
          },
          {
            "text": " in the manual."
          }
        ],
        [
          {
            "bold": "A device is missing"
          },
          {
            "text": ": check that it shows in the Zigbee2MQTT interface. Sowel only sees what Zigbee2MQTT publishes."
          }
        ],
        [
          {
            "bold": "The light doesn't come on"
          },
          {
            "text": ": look at the light level shown at the top of the room. If it is above the threshold, the recipe considers the room bright enough."
          }
        ],
        [
          {
            "bold": "The recipe isn't in the list"
          },
          {
            "text": ": your lamp may only do on and off. Create it with the type Light (On/Off) and use the recipe "
          },
          {
            "bold": "Motion Light"
          },
          {
            "text": "."
          }
        ]
      ]
    },
    {
      "kind": "h2",
      "text": "Going further"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "The same recipe applies to the hall, the landing or the garage in a minute: create the room, its equipments, and apply it. To see why Sowel reasons in rooms rather than devices, read the article "
        },
        {
          "link": "Simply optimise the comfort of your home",
          "href": withBase("/en/articles/simply-optimise-the-comfort-of-your-home/")
        },
        {
          "text": "."
        }
      ]
    }
  ]
};
