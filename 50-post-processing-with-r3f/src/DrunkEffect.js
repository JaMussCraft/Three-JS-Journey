import { Effect } from 'postprocessing'
import * as THREE from 'three'

const clock = new THREE.Clock()

const fragmentShader = /* glsl */ `
    uniform float uFreq;
    uniform float uAmp;
    uniform float uTime;
    
    void mainUv(inout vec2 uv)
    {
        uv.y += sin(uv.x * uFreq + uTime) * uAmp;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        vec4 color = inputColor;
        color.rgb *= vec3(0.8, 1.0, 0.5);
        outputColor = color;
    }
`

export default class DrunkEffect extends Effect {
    constructor(frequency, amplitude) {
        super('DrunkEffect', fragmentShader, {
            uniforms: new Map([
                ['uFreq', { value: frequency }],
                ['uAmp', { value: amplitude }],
                ['uTime', { value: 0 }],
            ]),
        })
    }

    update() {

        // this.uniforms.set('uTime', {value: Math.round(clock.getElapsedTime())})
        this.uniforms.get('uTime').value = clock.getElapsedTime()
    }
}
