void main() {
    float strength = 0.05 / distance(gl_PointCoord, vec2(0.5)) - 0.1;
    // float strength = pow(1.0 -distance(gl_PointCoord, vec2(0.5)), 5.0);

    gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
}
