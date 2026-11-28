// Generated from the reviewed draft (sowel-site spec 005); edit the text here from now on.
import type { Article } from "../articles/types.ts";
import { withBase } from "../../lib/url.ts";

export const fr: Article = {
  "lang": "fr",
  "type": "tutorial",
  "path": "/fr/tutoriels/installer-sowel-sur-un-raspberry-pi/",
  "otherPath": "/en/tutorials/install-sowel-on-a-raspberry-pi/",
  "meta": {
    "title": "Installer Sowel sur un Raspberry Pi | Sowel",
    "description": "Ce tutoriel part d'un Raspberry Pi neuf et s'arrête quand Sowel vous accueille dans votre navigateur. Comptez une petite heure, dont une bonne part à attendre les téléchargements. Pas besoin de connaître Linux : chaque commande se copie telle quelle."
  },
  "datePublished": "2026-11-28",
  "title": "Installer Sowel sur un Raspberry Pi",
  "byline": "Marc Chachereau, créateur de Sowel.",
  "duration": "environ une heure",
  "blocks": [
    {
      "kind": "p",
      "runs": [
        {
          "text": "Ce tutoriel part d'un Raspberry Pi neuf et s'arrête quand Sowel vous accueille dans votre navigateur. Comptez une petite heure, dont une bonne part à attendre les téléchargements. Pas besoin de connaître Linux : chaque commande se copie telle quelle."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "Le matériel"
    },
    {
      "kind": "items",
      "ordered": false,
      "items": [
        [
          {
            "bold": "Un Raspberry Pi 4 avec au moins 4 Go de mémoire"
          },
          {
            "text": ", ou un Raspberry Pi 5. Un Pi 3 est trop juste pour Sowel et sa base d'historique."
          }
        ],
        [
          {
            "bold": "Son alimentation officielle."
          },
          {
            "text": " Une alimentation trop faible provoque des redémarrages au hasard, difficiles à diagnostiquer."
          }
        ],
        [
          {
            "bold": "Un petit SSD dans un boîtier USB 3"
          },
          {
            "text": ", voir l'astuce ci-dessous."
          }
        ],
        [
          {
            "bold": "Un câble Ethernet"
          },
          {
            "text": " relié à votre box, plus stable que le Wi-Fi pour un appareil qui tourne jour et nuit."
          }
        ],
        [
          {
            "bold": "Un ordinateur"
          },
          {
            "text": " sur le même réseau, pour préparer le disque puis piloter le Pi."
          }
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Un SSD mSATA plutôt qu'une carte SD",
      "runs": [
        {
          "text": "Sowel enregistre en continu l'historique de la maison. Une carte SD supporte mal ces écritures et finit souvent par lâcher au bout de quelques mois. Les petits SSD au format mSATA, de 64 ou 128 Go, se trouvent à petit prix, neufs ou reconditionnés. Glissés dans un boîtier mSATA vers USB 3, ils sont bien plus fiables et plus rapides qu'une carte SD. Branchez le boîtier sur un port USB bleu du Pi : ce sont les ports USB 3."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "1. Préparer le disque"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Le Pi va démarrer directement sur le SSD, sans carte SD. Installez "
        },
        {
          "bold": "Raspberry Pi Imager"
        },
        {
          "text": " sur votre ordinateur depuis raspberrypi.com/software, branchez le SSD dans son boîtier, puis lancez Imager :"
        }
      ]
    },
    {
      "kind": "items",
      "ordered": true,
      "items": [
        [
          {
            "bold": "Appareil"
          },
          {
            "text": " : Raspberry Pi 4, ou 5."
          }
        ],
        [
          {
            "bold": "Système"
          },
          {
            "text": " : Raspberry Pi OS (other), puis "
          },
          {
            "bold": "Raspberry Pi OS Lite (64-bit)"
          },
          {
            "text": ". C'est une Debian sans interface graphique : le Pi n'aura ni écran ni clavier, vous le piloterez depuis votre ordinateur."
          }
        ],
        [
          {
            "bold": "Stockage"
          },
          {
            "text": " : votre SSD."
          }
        ],
        [
          {
            "text": "Quand Imager propose de personnaliser l'installation, acceptez. Donnez au Pi le nom d'hôte "
          },
          {
            "code": "sowel"
          },
          {
            "text": ", choisissez un nom d'utilisateur et un mot de passe, réglez le "
          },
          {
            "bold": "fuseau horaire"
          },
          {
            "text": " sur le vôtre (Sowel le reprend pour ses horaires), et activez "
          },
          {
            "bold": "SSH"
          },
          {
            "text": " avec authentification par mot de passe."
          }
        ]
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Écrivez l'image. Branchez ensuite le SSD sur un port USB bleu du Pi, puis le câble Ethernet, et l'alimentation en dernier."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Votre Pi ne démarre pas sur le SSD ?",
      "runs": [
        {
          "text": "Les Raspberry Pi 4 récents démarrent sur USB sans réglage. Un modèle plus ancien demande de mettre à jour son chargeur de démarrage une fois : dans Imager, choisissez Misc utility images, puis Bootloader, puis USB Boot, écrivez-le sur une carte SD, démarrez le Pi dessus une minute, puis retirez la carte."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "2. Se connecter au Pi"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Laissez une à deux minutes au premier démarrage. Ouvrez ensuite un terminal sur votre ordinateur (Terminal sur Mac, PowerShell sur Windows) et connectez-vous, en remplaçant "
        },
        {
          "code": "marc"
        },
        {
          "text": " par le nom d'utilisateur choisi :"
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
          "text": "Répondez "
        },
        {
          "code": "yes"
        },
        {
          "text": " à la question sur l'empreinte, puis tapez votre mot de passe. Vérifiez que le système est bien en 64 bits :"
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
          "text": "Mettez enfin le système à jour. Cela prend quelques minutes :"
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
      "title": "sowel.local ne répond pas ?",
      "runs": [
        {
          "text": "Cherchez l'adresse IP du Pi dans l'interface de votre box, parmi les appareils connectés, et utilisez-la à la place : "
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
      "text": "3. Installer Docker"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Sowel tourne dans Docker, qui l'isole du reste du système et rend les mises à jour simples. Installez-le, puis donnez à votre utilisateur le droit de s'en servir :"
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
          "text": "Fermez la session avec "
        },
        {
          "code": "exit"
        },
        {
          "text": ", puis reconnectez-vous avec la même commande "
        },
        {
          "code": "ssh"
        },
        {
          "text": ". Sans cette reconnexion, le nouveau droit n'est pas pris en compte et l'installation de Sowel échoue. Vérifiez que Docker répond :"
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
      "text": "4. Installer Sowel"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Une seule commande télécharge Sowel et sa base d'historique, les démarre et attend qu'ils répondent :"
        }
      ]
    },
    {
      "kind": "code",
      "cmd": "curl -fsSL https://raw.githubusercontent.com/mchacher/sowel/main/scripts/install.sh | sh",
      "output": "Detected timezone: Europe/Paris (set in docker-compose.yml)\nPulling images…\nStarting Sowel…\nWaiting for Sowel to be ready ✓\n\nSowel is running.\n\n  → http://192.168.1.42:3000"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Le premier téléchargement prend quelques minutes. Notez l'adresse affichée à la fin. Sowel redémarre tout seul avec le Pi : il n'y a rien d'autre à configurer."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "5. Créer votre compte"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Ouvrez cette adresse dans le navigateur de votre ordinateur. "
        },
        {
          "code": "http://sowel.local:3000"
        },
        {
          "text": " fonctionne aussi. Sowel vous demande de créer le compte administrateur :"
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t1-setup.webp"),
        "alt": "La première page de Sowel : le compte administrateur.",
        "width": 1100,
        "height": 1420
      },
      "caption": "La première page de Sowel : le compte administrateur."
    },
    {
      "kind": "callout",
      "tone": "warn",
      "title": "Notez bien votre mot de passe",
      "runs": [
        {
          "text": "Sowel ne passe par aucun service en ligne, il n'y a donc pas de récupération par e-mail. Vous pourrez activer la double authentification plus tard, dans les réglages de votre compte."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "6. Situer la maison"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Sowel demande ensuite un nom pour la maison et sa position. La position sert à calculer les heures de lever et de coucher du soleil, que les recettes peuvent utiliser. Un clic droit sur votre maison dans Google Maps affiche la latitude et la longitude."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t1-welcome.webp"),
        "alt": "Le nom de la maison et sa position.",
        "width": 992,
        "height": 960
      },
      "caption": "Le nom de la maison et sa position."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Cliquez sur "
        },
        {
          "bold": "Continuer"
        },
        {
          "text": ". Sowel redémarre son moteur quelques secondes et vous arrivez sur l'accueil."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t1-home.webp"),
        "alt": "Sowel est installé. La maison est encore vide.",
        "width": 1600,
        "height": 1025
      },
      "caption": "Sowel est installé. La maison est encore vide."
    },
    {
      "kind": "h2",
      "text": "Si ça ne marche pas"
    },
    {
      "kind": "items",
      "ordered": false,
      "items": [
        [
          {
            "bold": "« cannot reach the Docker daemon »"
          },
          {
            "text": " : vous ne vous êtes pas reconnecté après l'étape 3. Tapez "
          },
          {
            "code": "exit"
          },
          {
            "text": ", reconnectez-vous et relancez la commande d'installation."
          }
        ],
        [
          {
            "bold": "La page ne s'affiche pas"
          },
          {
            "text": " : regardez ce que dit Sowel avec "
          },
          {
            "code": "cd ~/sowel && docker compose logs -f"
          },
          {
            "text": ", et quittez avec Ctrl+C."
          }
        ],
        [
          {
            "bold": "Le Pi redémarre tout seul"
          },
          {
            "text": " : c'est presque toujours l'alimentation. Utilisez l'alimentation officielle."
          }
        ]
      ]
    },
    {
      "kind": "h2",
      "text": "Et maintenant"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Sowel tourne, mais il ne connaît encore aucun appareil. Le tutoriel suivant connecte une lampe et un détecteur Zigbee, crée la première pièce et y applique une recette : "
        },
        {
          "link": "Allumer la lumière quand on entre dans une pièce",
          "href": withBase("/fr/tutoriels/allumer-la-lumiere-quand-on-entre-dans-une-piece/")
        },
        {
          "text": "."
        }
      ]
    }
  ]
};
