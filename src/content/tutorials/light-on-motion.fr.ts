// Generated from the reviewed draft (sowel-site spec 005); edit the text here from now on.
import type { Article } from "../articles/types.ts";
import { withBase } from "../../lib/url.ts";

export const fr: Article = {
  "lang": "fr",
  "type": "tutorial",
  "path": "/fr/tutoriels/allumer-la-lumiere-quand-on-entre-dans-une-piece/",
  "otherPath": "/en/tutorials/turn-the-light-on-when-you-walk-into-a-room/",
  "meta": {
    "title": "Allumer la lumière quand on entre dans une pièce | Sowel",
    "description": "C'est la première automatisation que tout le monde veut : la lumière s'allume quand vous entrez dans le séjour et s'éteint quand vous partez. Avec Sowel, aucune règle à écrire. Vous décrivez la pièce et ce qu'elle contient, puis vous lui appliquez une recette. Comptez une heure si vous partez de zéro côté Zigbee, une vingtaine de minutes sinon."
  },
  "datePublished": "2026-11-28",
  "title": "Allumer la lumière quand on entre dans une pièce",
  "byline": "Marc Chachereau, créateur de Sowel.",
  "duration": "environ une heure",
  "blocks": [
    {
      "kind": "p",
      "runs": [
        {
          "text": "C'est la première automatisation que tout le monde veut : la lumière s'allume quand vous entrez dans le séjour et s'éteint quand vous partez. Avec Sowel, aucune règle à écrire. Vous décrivez la pièce et ce qu'elle contient, puis vous lui appliquez une recette. Comptez une heure si vous partez de zéro côté Zigbee, une vingtaine de minutes sinon."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "Avant de commencer"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Ce tutoriel suppose que Sowel est installé, par exemple en suivant "
        },
        {
          "link": "Installer Sowel sur un Raspberry Pi",
          "href": withBase("/fr/tutoriels/installer-sowel-sur-un-raspberry-pi/")
        },
        {
          "text": ". Sowel ne parle pas directement aux appareils Zigbee : il passe par "
        },
        {
          "bold": "Zigbee2MQTT"
        },
        {
          "text": ", un logiciel libre qui pilote le dongle radio et publie l'état de chaque appareil sur un "
        },
        {
          "bold": "broker MQTT"
        },
        {
          "text": ". Cette préparation se fait une seule fois pour toute la maison."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "Le matériel Zigbee"
    },
    {
      "kind": "items",
      "ordered": false,
      "items": [
        [
          {
            "bold": "Un dongle Zigbee USB"
          },
          {
            "text": ", qui sert de coordinateur au réseau. Le SONOFF ZBDongle-E est peu coûteux et très bien pris en charge par Zigbee2MQTT. La page Supported Adapters de zigbee2mqtt.io liste les autres modèles recommandés."
          }
        ],
        [
          {
            "bold": "Une rallonge USB"
          },
          {
            "text": " d'un mètre environ, voir l'astuce ci-dessous."
          }
        ],
        [
          {
            "bold": "Une lampe à intensité variable et un détecteur de mouvement Zigbee."
          },
          {
            "text": " Ce tutoriel utilise une ampoule Philips Hue et un détecteur Aqara, qui mesure aussi la luminosité. Avant d'acheter, vérifiez qu'un appareil figure dans la liste Supported Devices de zigbee2mqtt.io : elle en compte des milliers."
          }
        ]
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "Éloignez le dongle du Pi",
      "runs": [
        {
          "text": "Les ports USB 3 et les SSD perturbent la radio Zigbee, qui utilise la même bande que le Wi-Fi. Branchez le dongle sur un port USB noir, au bout de la rallonge, à l'écart du Pi et de son disque. C'est la cause la plus fréquente d'un réseau Zigbee instable."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "Installer le broker MQTT"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Le broker est la boîte aux lettres entre Zigbee2MQTT et Sowel. Installez Mosquitto sur le Pi :"
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
          "text": "Par défaut, il n'écoute que le Pi lui-même. Ouvrez-le au réseau local, ce qui permet à Sowel de le joindre depuis Docker :"
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
      "title": "Et la sécurité ?",
      "runs": [
        {
          "text": "Sans mot de passe, n'importe quel appareil de votre réseau local peut lire et écrire sur le broker. C'est acceptable chez soi, derrière la box, tant que le port 1883 n'est pas ouvert sur Internet. La page "
        },
        {
          "link": "Préparer l'hôte",
          "href": "https://docs.sowel.org/fr/user/host-setup/"
        },
        {
          "text": " du manuel explique comment ajouter un mot de passe."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "Installer Zigbee2MQTT"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Zigbee2MQTT tourne dans Docker, comme Sowel. Il faut lui dire trois choses : où se trouve le dongle, de quel type il est, et où joindre le broker. Prenez ces étapes dans l'ordre : chacune prépare la suivante."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "bold": "Trouver le dongle."
        },
        {
          "text": " Branchez-le, puis demandez au Pi la liste des périphériques série :"
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
          "text": "La ligne affichée est le nom complet de votre dongle. Il ne change pas d'un redémarrage à l'autre, contrairement à "
        },
        {
          "code": "ttyUSB0"
        },
        {
          "text": " ou "
        },
        {
          "code": "ttyACM0"
        },
        {
          "text": ". Notez-le, ou gardez le terminal ouvert pour le copier. Si rien ne s'affiche, débranchez le dongle, rebranchez-le et relancez la commande."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "bold": "Créer le fichier de configuration."
        },
        {
          "text": " Créez un dossier pour Zigbee2MQTT et ouvrez un nouveau fichier :"
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
          "text": "Collez-y le contenu ci-dessous. Sur la dernière ligne, remplacez "
        },
        {
          "code": "VOTRE-DONGLE"
        },
        {
          "text": " par le nom affiché à l'étape précédente, sans toucher à la partie après les deux-points. Adaptez au besoin la ligne "
        },
        {
          "code": "TZ"
        },
        {
          "text": " à votre fuseau horaire. Enregistrez avec "
        },
        {
          "bold": "Ctrl+O"
        },
        {
          "text": " puis "
        },
        {
          "bold": "Entrée"
        },
        {
          "text": ", et quittez avec "
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
      "content": "services:\n  zigbee2mqtt:\n    image: ghcr.io/koenkk/zigbee2mqtt\n    container_name: zigbee2mqtt\n    restart: unless-stopped\n    ports:\n      - 8080:8080\n    environment:\n      - TZ=Europe/Paris\n    volumes:\n      - ./data:/app/data\n      - /run/udev:/run/udev:ro\n    extra_hosts:\n      - host.docker.internal:host-gateway\n    devices:\n      - /dev/serial/by-id/VOTRE-DONGLE:/dev/ttyACM0"
    },
    {
      "kind": "callout",
      "tone": "note",
      "title": "Pourquoi deux chemins sur la dernière ligne ?",
      "runs": [
        {
          "text": "Zigbee2MQTT vit dans un conteneur, qui ne voit pas les fichiers du Pi. La ligne "
        },
        {
          "code": "devices"
        },
        {
          "text": " lui prête le dongle : à gauche des deux-points, le chemin sur le Pi ; à droite, le nom sous lequel le conteneur le voit. Ce nom est fixé à "
        },
        {
          "code": "/dev/ttyACM0"
        },
        {
          "text": " quel que soit votre dongle. C'est lui, et lui seul, que vous donnerez à Zigbee2MQTT."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "bold": "Démarrer Zigbee2MQTT :"
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
          "bold": "Répondre aux trois questions du premier lancement."
        },
        {
          "text": " Ouvrez "
        },
        {
          "code": "http://sowel.local:8080"
        },
        {
          "text": " dans votre navigateur. Au premier démarrage, Zigbee2MQTT affiche un assistant de configuration. Trois réponses comptent :"
        }
      ]
    },
    {
      "kind": "items",
      "ordered": false,
      "items": [
        [
          {
            "bold": "Le port du dongle"
          },
          {
            "text": " : "
          },
          {
            "code": "/dev/ttyACM0"
          },
          {
            "text": ", le nom vu par le conteneur. Pas le long chemin "
          },
          {
            "code": "/dev/serial/by-id/…"
          },
          {
            "text": " : le conteneur ne le connaît pas, et Zigbee2MQTT ne trouverait pas le dongle."
          }
        ],
        [
          {
            "bold": "Le type d'adaptateur"
          },
          {
            "text": " : il dépend de votre dongle, voir le tableau ci-dessous."
          }
        ],
        [
          {
            "bold": "Le serveur MQTT"
          },
          {
            "text": " : "
          },
          {
            "code": "mqtt://host.docker.internal:1883"
          },
          {
            "text": ", c'est-à-dire le Pi, grâce à la ligne "
          },
          {
            "code": "extra_hosts"
          },
          {
            "text": " du fichier. Pas "
          },
          {
            "code": "localhost"
          },
          {
            "text": " : dans le conteneur, "
          },
          {
            "code": "localhost"
          },
          {
            "text": " désigne le conteneur lui-même, où aucun broker ne tourne."
          }
        ]
      ]
    },
    {
      "kind": "table",
      "head": [
        "Votre dongle",
        "Type d'adaptateur"
      ],
      "rows": [
        [
          [
            {
              "text": "SONOFF ZBDongle-E, Home Assistant Connect ZBT-1 (ex-SkyConnect)"
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
          "text": "Votre modèle n'est pas dans le tableau ? La page Supported Adapters de zigbee2mqtt.io indique le type de chacun. Laissez les autres réglages de l'assistant à leur valeur par défaut, notamment le topic "
        },
        {
          "code": "zigbee2mqtt"
        },
        {
          "text": ", que Sowel attend. Si Zigbee2MQTT refuse de démarrer avec "
        },
        {
          "code": "ember"
        },
        {
          "text": ", le micrologiciel du dongle est trop ancien : la même page explique comment le mettre à jour."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Une fois l'assistant validé, Zigbee2MQTT redémarre et affiche une liste d'appareils vide. Le dongle et le broker sont prêts."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "Appairer la lampe et le détecteur"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Dans l'interface de Zigbee2MQTT, cliquez sur "
        },
        {
          "bold": "Permit join"
        },
        {
          "text": " pour autoriser les nouveaux appareils, puis mettez chacun en mode appairage en suivant sa notice. Une ampoule Hue neuve s'appaire dès sa première mise sous tension. Pour le détecteur Aqara, maintenez son petit bouton enfoncé quelques secondes, jusqu'à ce que la diode bleue clignote."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Donnez-leur ensuite un nom court dans Zigbee2MQTT. Dans ce tutoriel, ce sont "
        },
        {
          "code": "bulb_01"
        },
        {
          "text": " et "
        },
        {
          "code": "motion_01"
        },
        {
          "text": ". Quand les deux apparaissent dans la liste de Zigbee2MQTT, tout est prêt côté Zigbee."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Le chemin est ensuite toujours le même dans Sowel : les "
        },
        {
          "bold": "appareils"
        },
        {
          "text": " arrivent du réseau, vous en faites des "
        },
        {
          "bold": "équipements"
        },
        {
          "text": ", rangés dans une "
        },
        {
          "bold": "pièce"
        },
        {
          "text": ", et une "
        },
        {
          "bold": "recette"
        },
        {
          "text": " s'occupe de la pièce."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "1. Connecter Zigbee2MQTT"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Ouvrez "
        },
        {
          "bold": "Administration"
        },
        {
          "text": ", puis "
        },
        {
          "bold": "Plugins"
        },
        {
          "text": ". Dans l'onglet "
        },
        {
          "bold": "Catalogue"
        },
        {
          "text": ", cherchez « zigbee » et cliquez sur "
        },
        {
          "bold": "Installer"
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
        "alt": "Le plugin Zigbee2MQTT dans le catalogue.",
        "width": 1500,
        "height": 670
      },
      "caption": "Le plugin Zigbee2MQTT dans le catalogue."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Ouvrez ensuite "
        },
        {
          "bold": "Administration"
        },
        {
          "text": ", "
        },
        {
          "bold": "Intégrations"
        },
        {
          "text": ", puis "
        },
        {
          "bold": "Zigbee2MQTT"
        },
        {
          "text": ". L'adresse du broker est déjà remplie avec "
        },
        {
          "code": "mqtt://host.docker.internal:1883"
        },
        {
          "text": ", c'est-à-dire le Pi lui-même. Si votre broker tourne ailleurs, remplacez-la par son adresse. Cliquez sur "
        },
        {
          "bold": "Enregistrer"
        },
        {
          "text": ", puis sur "
        },
        {
          "bold": "Démarrer"
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
        "alt": "La configuration de l'intégration Zigbee2MQTT.",
        "width": 965,
        "height": 1800
      },
      "caption": "La configuration de l'intégration Zigbee2MQTT."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Après quelques secondes, l'état passe à "
        },
        {
          "bold": "Connecté"
        },
        {
          "text": ". Ouvrez "
        },
        {
          "bold": "Administration"
        },
        {
          "text": ", "
        },
        {
          "bold": "Appareils"
        },
        {
          "text": " : la lampe et le détecteur sont là, avec leur marque et leur modèle. Sowel les a trouvés seul."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-devices.webp"),
        "alt": "Les deux appareils découverts depuis Zigbee2MQTT.",
        "width": 1600,
        "height": 706
      },
      "caption": "Les deux appareils découverts depuis Zigbee2MQTT."
    },
    {
      "kind": "h2",
      "text": "2. Créer la pièce"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Ouvrez "
        },
        {
          "bold": "Administration"
        },
        {
          "text": ", "
        },
        {
          "bold": "Topologie"
        },
        {
          "text": ", puis "
        },
        {
          "bold": "Ajouter une zone"
        },
        {
          "text": ". Appelez-la « Séjour » et choisissez "
        },
        {
          "bold": "Maison"
        },
        {
          "text": " comme zone parente."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-zone.webp"),
        "alt": "Le séjour, rangé dans la maison.",
        "width": 935,
        "height": 815
      },
      "caption": "Le séjour, rangé dans la maison."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Vous pourrez ajouter des étages plus tard et y ranger vos pièces : Sowel calcule pour chaque niveau la présence, la température ou le nombre de lumières allumées."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "3. Créer les équipements"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Un appareil, c'est ce qui est sur le réseau : "
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
          "text": ". Un équipement, c'est ce qui est dans la pièce et que vous reconnaissez : le plafonnier, le détecteur. C'est avec les équipements que Sowel raisonne."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Ouvrez "
        },
        {
          "bold": "Administration"
        },
        {
          "text": ", "
        },
        {
          "bold": "Équipements"
        },
        {
          "text": ", puis "
        },
        {
          "bold": "Ajouter un équipement"
        },
        {
          "text": ". Choisissez le type "
        },
        {
          "bold": "Lumière (Dimmable)"
        },
        {
          "text": ", appelez-le « Plafonnier » et rangez-le dans le séjour."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-equip-a.webp"),
        "alt": "Le type, le nom et la pièce de l'équipement.",
        "width": 1095,
        "height": 831
      },
      "caption": "Le type, le nom et la pièce de l'équipement."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Cliquez sur "
        },
        {
          "bold": "Suivant"
        },
        {
          "text": ". Sowel ne propose que les appareils compatibles avec une lumière dimmable : cochez l'ampoule, puis cliquez sur "
        },
        {
          "bold": "Créer"
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
        "alt": "Seuls les appareils compatibles sont proposés.",
        "width": 1095,
        "height": 699
      },
      "caption": "Seuls les appareils compatibles sont proposés."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Recommencez pour le détecteur, avec le type "
        },
        {
          "bold": "Capteur"
        },
        {
          "text": ", le nom « Détecteur » et l'appareil "
        },
        {
          "code": "motion_01"
        },
        {
          "text": ". Les deux équipements apparaissent sous le séjour, et le détecteur remonte déjà la luminosité de la pièce."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-equipments.webp"),
        "alt": "Le plafonnier et le détecteur, dans le séjour.",
        "width": 1600,
        "height": 345
      },
      "caption": "Le plafonnier et le détecteur, dans le séjour."
    },
    {
      "kind": "h2",
      "text": "4. Appliquer la recette"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Retournez dans "
        },
        {
          "bold": "Plugins"
        },
        {
          "text": ", onglet "
        },
        {
          "bold": "Catalogue"
        },
        {
          "text": ", et installez la recette "
        },
        {
          "bold": "Lumière dimmable sur mouvement"
        },
        {
          "text": ". Ouvrez ensuite "
        },
        {
          "bold": "Maison"
        },
        {
          "text": ", puis "
        },
        {
          "bold": "Séjour"
        },
        {
          "text": ". Dans la colonne "
        },
        {
          "bold": "Comportements"
        },
        {
          "text": ", cliquez sur le "
        },
        {
          "bold": "+"
        },
        {
          "text": " de "
        },
        {
          "bold": "Recettes"
        },
        {
          "text": " et choisissez la recette."
        }
      ]
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Elle pose quelques questions :"
        }
      ]
    },
    {
      "kind": "items",
      "ordered": false,
      "items": [
        [
          {
            "bold": "Lumières"
          },
          {
            "text": " : le plafonnier."
          }
        ],
        [
          {
            "bold": "Délai"
          },
          {
            "text": " : 5 minutes sans mouvement avant d'éteindre."
          }
        ],
        [
          {
            "bold": "Luminosité"
          },
          {
            "text": " : 254, soit la pleine puissance. L'échelle va de 1 à 254."
          }
        ],
        [
          {
            "bold": "Seuil lux"
          },
          {
            "text": " : 30. Au-dessus, la pièce est assez claire et la lumière ne s'allume pas."
          }
        ],
        [
          {
            "bold": "Plage 1"
          },
          {
            "text": " : de 22 h à 7 h, luminosité 40. La nuit, une lumière douce suffit."
          }
        ]
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-recipe.webp"),
        "alt": "La recette, réglée pour le séjour.",
        "width": 800,
        "height": 1840
      },
      "caption": "La recette, réglée pour le séjour."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Cliquez sur "
        },
        {
          "bold": "Créer"
        },
        {
          "text": ". La recette tourne aussitôt."
        }
      ]
    },
    {
      "kind": "callout",
      "tone": "tip",
      "title": "La recette ne connaît pas le détecteur",
      "runs": [
        {
          "text": "Vous ne lui avez jamais parlé du détecteur. Elle lit la présence et la luminosité que Sowel calcule pour le séjour. Si vous ajoutez un deuxième détecteur dans la pièce, elle en tiendra compte sans aucun réglage."
        }
      ]
    },
    {
      "kind": "h2",
      "text": "5. Tester"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Passez devant le détecteur. La pièce passe en "
        },
        {
          "bold": "Mouvement"
        },
        {
          "text": ", le plafonnier s'allume, et le journal d'activité, à droite, raconte ce qui s'est passé et pourquoi. Cinq minutes après le dernier mouvement, la lumière s'éteint."
        }
      ]
    },
    {
      "kind": "shot",
      "image": {
        "src": withBase("/img/fr/tutorials/t2-room-on.webp"),
        "alt": "Le séjour au moment où quelqu'un entre.",
        "width": 1600,
        "height": 1125
      },
      "caption": "Le séjour au moment où quelqu'un entre."
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "Un interrupteur sur la carte de la recette permet de la suspendre, par exemple pour une soirée film."
        }
      ]
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
            "bold": "L'intégration reste déconnectée"
          },
          {
            "text": " : vérifiez l'adresse du broker. Si Mosquitto tourne sur le Pi, il doit écouter sur le réseau et pas seulement en local, voir "
          },
          {
            "link": "Préparer l'hôte",
            "href": "https://docs.sowel.org/fr/user/host-setup/"
          },
          {
            "text": " dans le manuel."
          }
        ],
        [
          {
            "bold": "Un appareil manque"
          },
          {
            "text": " : vérifiez qu'il apparaît dans l'interface de Zigbee2MQTT. Sowel ne voit que ce que Zigbee2MQTT publie."
          }
        ],
        [
          {
            "bold": "La lumière ne s'allume pas"
          },
          {
            "text": " : regardez la luminosité affichée en haut de la pièce. Si elle dépasse le seuil, la recette considère qu'il fait assez clair."
          }
        ],
        [
          {
            "bold": "La recette n'apparaît pas dans la liste"
          },
          {
            "text": " : votre lampe ne fait peut-être que marche et arrêt. Créez-la avec le type Lumière (marche/arrêt) et utilisez la recette "
          },
          {
            "bold": "Lumière sur mouvement"
          },
          {
            "text": "."
          }
        ]
      ]
    },
    {
      "kind": "h2",
      "text": "Pour aller plus loin"
    },
    {
      "kind": "p",
      "runs": [
        {
          "text": "La même recette s'applique à l'entrée, au couloir ou au garage en une minute : créez la pièce, ses équipements, et appliquez-la. Pour comprendre pourquoi Sowel raisonne en pièces plutôt qu'en appareils, lisez l'article "
        },
        {
          "link": "Optimiser simplement le confort de votre maison",
          "href": withBase("/fr/articles/optimiser-simplement-le-confort-de-votre-maison/")
        },
        {
          "text": "."
        }
      ]
    }
  ]
};
