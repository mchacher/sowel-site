# Spec 005: Tutorials, plan

1. Drafts in French, reviewed by the maintainer on a local review page (two rounds; the second added the Zigbee
   preparation and the Zigbee2MQTT Docker setup).
2. Provisional screenshots on a fresh Sowel 1.90.0 with a simulated Zigbee2MQTT; the whole second tutorial run end to
   end there. Found and fixed on the way: sowel #1328.
3. Content types, rendering, routes, Docs menu on two levels, checks. English version.
4. `npm run validate`, agent review, PR. Rendered pages reviewed by the maintainer.
5. Before publication: final screenshots per language, the Zigbee2MQTT steps checked on real hardware, and the Sowel
   release carrying #1328.

## Test plan

- `npm run validate` green: parity of the new blocks, built pages, Docs menu with three groups, sitemap.
- By hand, desktop and phone: the menu opens on the right group, switches on hover and tap, the copy buttons copy
  the command (several lines for a multi-line one) and the file.
