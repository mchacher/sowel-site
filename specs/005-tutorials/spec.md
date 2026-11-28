# Spec 005: Tutorials

**Status**: Draft, for the maintainer's review of the rendered pages
**Parent**: sowel spec 209 (launch plan, step 3: "less technical articles, or small tutorials")
**Depends on**: spec 002 (articles)

## Context

The articles explain ideas. Many visitors first want to do something with Sowel: install it, then get a first
automation working. Two step-by-step tutorials cover that path, from a new Raspberry Pi to a light that comes on
when someone walks into the room. They sit beside the articles and the manual, in the Docs menu.

## Goals

- Two tutorials, in English and French:
  - "Install Sowel on a Raspberry Pi" / « Installer Sowel sur un Raspberry Pi »: Pi 4 (4 GB) or Pi 5, Raspberry Pi
    OS Lite (Debian, no desktop), a small mSATA SSD over USB 3 rather than an SD card, Docker, the one-line install,
    the first account and the house's location.
  - "Turn the light on when you walk into a room" / « Allumer la lumière quand on entre dans une pièce »: the Zigbee
    hardware (a dongle, a dimmable lamp, a motion sensor), Mosquitto, Zigbee2MQTT in Docker (a ready `compose.yml`, the
    three answers of its wizard, the adapter type by dongle), pairing, then in Sowel the integration, the room, the
    equipments and the recipe Motion Light (Dimmable).
- Pages at `/en/tutorials/<slug>/` and `/fr/tutoriels/<slug>/`, in the article layout, tagged « Tutorial », with the
  duration in place of the reading time and no exergue.
- Blocks a tutorial needs: numbered steps, a terminal command with a copy button and what it prints, a file to create
  with its name, callouts (tip, warning, good to know), a table, a screenshot.
- The Docs menu gets two levels: a rail naming Articles, Tutorials and Manual, and a pane showing one group. It opens
  on the group of the current page. Without the script, the three groups stay stacked.

## Review notes (agent review, 2026-11-28)

- The Zigbee2MQTT compose reaches the broker through `host.docker.internal` (as Sowel's own compose does), so no
  step depends on the Pi's LAN address. The SLZB-06 (an Ethernet coordinator) left the adapter table; a sentence
  covers a ZBDongle-E whose firmware is too old for `ember`.
- The Pi's time zone is set in Imager: the install script copies it into Sowel's compose.
- Left for later: automated checks for em dash, middle dot and French spacing in article and tutorial content, and a
  check that a tutorial entry carries `type: "tutorial"`.

## Non-goals

- No tutorials index page yet: the Docs menu lists them all while there are few.
- No interactive terminal, no download. Commands are copied, as in the install section of the home page.

## Requirements

- Content is typed (the `Article` type, with `type: "tutorial"` and a `duration`), one module per language, in a
  registry of its own (`src/content/tutorials/index.ts`). `npm run lint:i18n` compares the two languages block by
  block, as for the articles.
- Every page has its metadata, canonical, hreflang pair, Open Graph tags and JSON-LD Article; both are in the sitemap.
- The built-output check covers the tutorial pages and the third group of the Docs menu.
- Every command of the Pi tutorial and the Sowel steps of the second one were run on a fresh Sowel 1.90.0 in Docker,
  with a simulated Zigbee2MQTT. The Zigbee2MQTT side (dongle path, wizard fields) is to be checked on real hardware
  before publication.
- The second tutorial relies on sowel #1328 (integration defaults saved from the form), merged and shipped in the
  release after 1.90.0. It is published after that release.
- The screenshots are provisional and in French in both languages; the final ones, per language, replace them before
  publication.
