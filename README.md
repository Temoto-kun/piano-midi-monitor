# piano-midi-monitor

Simple monitor for displaying MIDI status for digital pianos.

Supports a **full MIDI key range**, as well as
granular pedal status display for **soft pedal/una corda** (MIDI CC number 67),
**sostenuto** (MIDI CC number 66), and **sustain** (MIDI CC number 64, values from 0-127).

![Screenshot](./docs/screenshot.png)

Tested with Node v.14.1.0.

## Instructions

### Building

Just run:

```shell script
yarn build
```

A directory `dist/` should be generated along with build output.

### Development

Just run:

```shell script
yarn start
```

Create React App should run in watch mode, then Electron should spawn the application window shortly.

## License

[MIT License](./LICENSE)
