"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export interface HeroFeature {
  name: string;
  value: string;
  position: string;
}

export interface HeroOdysseyProps {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  features: HeroFeature[];
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  defaultHue?: number;
  showHueSlider?: boolean;
}

interface ElasticHueSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

function ElasticHueSlider({
  value,
  onChange,
  min = 0,
  max = 360,
  step = 1,
  label = "Adjust Hue",
}: ElasticHueSliderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const progress = (value - min) / (max - min);
  const thumbPosition = progress * 100;

  return (
    <div className="relative mb-6 flex w-full max-w-xs flex-col items-center">
      {label && (
        <label htmlFor="hue-slider-native" className="mb-2 text-sm text-gray-300">
          {label}
        </label>
      )}
      <div className="relative flex h-6 w-full items-center">
        <input
          id="hue-slider-native"
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="absolute inset-0 z-20 h-full w-full cursor-pointer appearance-none bg-transparent"
          style={{ WebkitAppearance: "none" }}
        />
        <div className="absolute left-0 z-0 h-1.5 w-full rounded-full bg-gray-700" />
        <div
          className="absolute left-0 z-10 h-1.5 rounded-full"
          style={{
            width: `${thumbPosition}%`,
            backgroundColor: `hsl(${value}, 70%, 55%)`,
          }}
        />
        <motion.div
          className="absolute top-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${thumbPosition}%` }}
          animate={{ scale: isDragging ? 1.2 : 1 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: isDragging ? 20 : 30,
          }}
        >
          <div
            className="h-4 w-4 rounded-full border-2 border-white shadow-lg"
            style={{ backgroundColor: `hsl(${value}, 70%, 55%)` }}
          />
        </motion.div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          transition={{ duration: 0.2 }}
          className="mt-2 text-xs text-gray-400"
        >
          {value}°
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface LightningProps {
  hue?: number;
  xOffset?: number;
  speed?: number;
  intensity?: number;
  size?: number;
}

function Lightning({
  hue = 160,
  xOffset = 0,
  speed = 1,
  intensity = 1,
  size = 1,
}: LightningProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision mediump float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float uHue;
      uniform float uXOffset;
      uniform float uSpeed;
      uniform float uIntensity;
      uniform float uSize;
      
      #define OCTAVE_COUNT 10

      vec3 hsv2rgb(vec3 c) {
          vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0,4.0,2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
          return c.z * mix(vec3(1.0), rgb, c.y);
      }

      float hash11(float p) {
          p = fract(p * .1031);
          p *= p + 33.33;
          p *= p + p;
          return fract(p);
      }

      float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * .1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
      }

      mat2 rotate2d(float theta) {
          float c = cos(theta);
          float s = sin(theta);
          return mat2(c, -s, s, c);
      }

      float noise(vec2 p) {
          vec2 ip = floor(p);
          vec2 fp = fract(p);
          float a = hash12(ip);
          float b = hash12(ip + vec2(1.0, 0.0));
          float c = hash12(ip + vec2(0.0, 1.0));
          float d = hash12(ip + vec2(1.0, 1.0));
          
          vec2 t = smoothstep(0.0, 1.0, fp);
          return mix(mix(a, b, t.x), mix(c, d, t.x), t.y);
      }

      float fbm(vec2 p) {
          float value = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < OCTAVE_COUNT; ++i) {
              value += amplitude * noise(p);
              p *= rotate2d(0.45);
              p *= 2.0;
              amplitude *= 0.5;
          }
          return value;
      }

      void mainImage(out vec4 fragColor, in vec2 fragCoord) {
          vec2 uv = fragCoord / iResolution.xy;
          uv = 2.0 * uv - 1.0;
          uv.x *= iResolution.x / iResolution.y;
          uv.x += uXOffset;
          uv += 2.0 * fbm(uv * uSize + 0.8 * iTime * uSpeed) - 1.0;
          
          float dist = abs(uv.x);
          vec3 baseColor = hsv2rgb(vec3(uHue / 360.0, 0.7, 0.8));
          vec3 col = baseColor * pow(mix(0.0, 0.07, hash11(iTime * uSpeed)) / dist, 1.0) * uIntensity;
          col = pow(col, vec3(1.0));
          fragColor = vec4(col, 1.0);
      }

      void main() {
          mainImage(gl_FragColor, gl_FragCoord.xy);
      }
    `;

    const compileShader = (source: string, type: number): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }
    gl.useProgram(program);

    const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const uHueLocation = gl.getUniformLocation(program, "uHue");
    const uXOffsetLocation = gl.getUniformLocation(program, "uXOffset");
    const uSpeedLocation = gl.getUniformLocation(program, "uSpeed");
    const uIntensityLocation = gl.getUniformLocation(program, "uIntensity");
    const uSizeLocation = gl.getUniformLocation(program, "uSize");

    const startTime = performance.now();
    let frameId = 0;

    const render = () => {
      resizeCanvas();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(iTimeLocation, (performance.now() - startTime) / 1000.0);
      gl.uniform1f(uHueLocation, hue);
      gl.uniform1f(uXOffsetLocation, xOffset);
      gl.uniform1f(uSpeedLocation, speed);
      gl.uniform1f(uIntensityLocation, intensity);
      gl.uniform1f(uSizeLocation, size);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frameId = requestAnimationFrame(render);
    };
    frameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(frameId);
    };
  }, [hue, xOffset, speed, intensity, size]);

  return <canvas ref={canvasRef} className="relative h-full w-full" />;
}

function FeatureItem({ name, value, position }: HeroFeature) {
  return (
    <div
      className={`absolute ${position} z-10 hidden transition-all duration-300 hover:scale-110 sm:block`}
    >
      <div className="group relative flex items-center gap-2">
        <div className="relative">
          <div className="h-2 w-2 rounded-full bg-emerald-400 group-hover:animate-pulse" />
          <div className="absolute -inset-1 rounded-full bg-emerald-400/20 opacity-70 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
        </div>
        <div className="relative text-white">
          <div className="font-medium transition-colors duration-300 group-hover:text-emerald-300">
            {name}
          </div>
          <div className="text-sm text-white/70 transition-colors duration-300 group-hover:text-white/90">
            {value}
          </div>
          <div className="absolute -inset-2 -z-10 rounded-lg bg-emerald-500/10 opacity-70 blur-md transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </div>
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.3, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export function HeroOdyssey({
  badge,
  title,
  subtitle,
  description,
  features,
  primaryCta,
  secondaryCta,
  defaultHue = 160,
  showHueSlider = true,
}: HeroOdysseyProps) {
  const [lightningHue, setLightningHue] = useState(defaultHue);

  return (
    <section className="relative w-full overflow-hidden bg-black text-white">
      <div className="relative z-20 mx-auto min-h-[calc(100dvh-4rem)] max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative top-[18%] z-20 w-full sm:top-[22%]"
        >
          {features.map((feature) => (
            <motion.div key={feature.name} variants={itemVariants}>
              <FeatureItem {...feature} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-30 mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          {showHueSlider && (
            <motion.div variants={itemVariants} className="w-full max-w-xs">
              <ElasticHueSlider
                value={lightningHue}
                onChange={setLightningHue}
                label="Adjust Lightning Hue"
              />
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            <span className="mb-6 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm text-emerald-300">
              {badge}
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="mb-2 text-5xl font-light md:text-7xl"
          >
            {title}
          </motion.h1>

          <motion.h2
            variants={itemVariants}
            className="bg-gradient-to-r from-emerald-200 via-cyan-200 to-emerald-300 bg-clip-text pb-3 text-3xl font-light text-transparent md:text-5xl"
          >
            {subtitle}
          </motion.h2>

          <motion.p variants={itemVariants} className="mb-9 max-w-2xl text-gray-400">
            {description}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex flex-col items-center gap-4 sm:mt-16 sm:flex-row"
          >
            <Link
              href={primaryCta.href}
              className="group inline-flex items-center gap-2 rounded-full bg-emerald-500/90 px-8 py-3 text-sm font-medium text-black transition-all hover:scale-105 hover:bg-emerald-400 active:scale-95"
            >
              {primaryCta.label}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 px-8 py-3 text-sm backdrop-blur-sm transition-all hover:scale-105 hover:bg-white/20 active:scale-95"
              >
                {secondaryCta.label}
              </Link>
            )}
          </motion.div>

          <motion.p variants={itemVariants} className="mt-6 text-xs text-gray-500">
            Tonkeeper · TON AppKit · Omniston SDK · No custody
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-black/80" />
        <div className="absolute left-1/2 top-[55%] h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-emerald-500/20 to-cyan-600/10 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-full w-full -translate-x-1/2 transform">
          <Lightning hue={lightningHue} xOffset={0} speed={1.6} intensity={0.6} size={2} />
        </div>
        <div className="absolute left-1/2 top-[55%] z-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_25%_90%,_#0d4f3c_15%,_#000000de_70%,_#000000ed_100%)] backdrop-blur-3xl" />
      </motion.div>
    </section>
  );
}
