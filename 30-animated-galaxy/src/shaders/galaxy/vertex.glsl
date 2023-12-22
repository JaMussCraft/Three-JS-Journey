uniform float uSize;
uniform float uTime;

attribute float aScale;

varying vec3 vColor;


void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float angle = uTime / length(modelPosition.xz) * .5;
    float modelPositionX = modelPosition.x * cos(angle) - modelPosition.z * sin(angle);
    float modelPositionZ = modelPosition.x * sin(angle) + modelPosition.z * cos(angle);
    modelPosition.x = modelPositionX;
    modelPosition.z = modelPositionZ;


    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    gl_Position = projectionPosition;

    gl_PointSize = uSize * aScale;
    gl_PointSize /= -viewPosition.z; // particle size attenuation

    vColor = color;

}