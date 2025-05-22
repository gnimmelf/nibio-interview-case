import * as THREE from "three";

export function createMarbleTileTexture(options: {
  fillColor?: string
  lineColor?: string
} = {}): THREE.Texture {
  const { fillColor, lineColor } = {
    fillColor: 'white',
    lineColor: 'black ',
  }
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 100 100">
      <defs>
        <filter id="marble" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="5" result="turb"/>
          <feDiffuseLighting in="turb" lighting-color="${fillColor}" surfaceScale="2">
            <feDistantLight azimuth="45" elevation="60"/>
          </feDiffuseLighting>
        </filter>
      </defs>

      <!-- Marble background -->
      <rect x="0" y="0" width="100" height="100" fill="${fillColor}" filter="url(#marble)"/>

      <!-- Grid lines -->
      <path d="M47,0 h6 v100 h-6 z M0,47 h100 v6 h-100 z" fill="${lineColor}"/>
    </svg>
  `;

  const svgBase64 = btoa(unescape(encodeURIComponent(svg)));
  const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

  const texture = new THREE.TextureLoader().load(dataUrl);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1); // You can increase this to tile more
  texture.flipY = false;
  texture.anisotropy = 16;
  texture.needsUpdate = true;

  return texture;
}


export function createOakWoodTexture(options: {
  fillColor?: string
  lineColor?: string
} = {}): THREE.Texture {
  const { fillColor, lineColor } = {
    fillColor: '#9E825C',
    lineColor: '#5a3a1a'
  }
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <defs>
      <filter id="stylizedWood" x="0" y="0" width="100%" height="100%">
        <!-- Create base wood turbulence -->
        <feTurbulence type="turbulence" baseFrequency="0.01 0.1" numOctaves="4" seed="7" result="turb"/>

        <!-- Stretch noise in vertical direction (to simulate long grain) -->
        <feComponentTransfer in="turb" result="stretched">
          <feFuncR type="linear" slope="2"/>
          <feFuncG type="linear" slope="1.5"/>
          <feFuncB type="linear" slope="1"/>
        </feComponentTransfer>

        <!-- Contrast -->
        <feColorMatrix in="stretched" type="matrix"
          values="1.8 0 0 0 -0.3
                  0 1.8 0 0 -0.3
                  0 0 1.8 0 -0.3
                  0 0 0 1 0" result="contrast"/>
      </filter>
    </defs>

    <!-- Wood background with stylized filter -->
    <rect x="0" y="0" width="256" height="256" fill="${fillColor}" />
    <rect x="0" y="0" width="256" height="256" filter="url(#stylizedWood)" opacity="0.5" />

    <!-- Optional: add faint wood rings -->
    <g opacity="0.1">
      <circle cx="128" cy="128" r="100" fill="none" stroke="${lineColor}" stroke-width="1"/>
      <circle cx="128" cy="128" r="85" fill="none" stroke="${lineColor}" stroke-width="0.8"/>
      <circle cx="128" cy="128" r="65" fill="none" stroke="${lineColor}" stroke-width="0.6"/>
      <circle cx="128" cy="128" r="45" fill="none" stroke="${lineColor}" stroke-width="0.4"/>
    </g>
  </svg>
    `;

  const svgBase64 = btoa(unescape(encodeURIComponent(svg)));
  const dataUrl = `data:image/svg+xml;base64,${svgBase64}`;

  const texture = new THREE.TextureLoader().load(dataUrl);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1); // adjust for tightness
  texture.anisotropy = 16;
  texture.flipY = false;
  texture.needsUpdate = true;

  return texture;
}