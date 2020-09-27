//片段着色器代码
precision mediump float;
// 从顶点着色器中传入的值
varying vec2 v_texcoord;
// 纹理
uniform sampler2D u_texture;
void main() {
    gl_FragColor = texture2D(u_texture, v_texcoord);
}