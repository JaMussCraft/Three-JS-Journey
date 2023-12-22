uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;

varying float vElevation;




void main() {
void main() {
    vec3 mixedColor = mix(uDepthColor, uSurfaceColor, vElevation);

    gl_FragColor =  vec4(mixedColor, 1.0);

    #include <colorspace_fragment> // for sRGB color space

}