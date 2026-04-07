import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function StaticOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000000',
          backgroundImage: `
            linear-gradient(0deg, transparent 24%, rgba(0, 255, 0, 0.05) 25%, rgba(0, 255, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05) 76%, transparent 77%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 255, 0, 0.05) 25%, rgba(0, 255, 0, 0.05) 26%, transparent 27%, transparent 74%, rgba(0, 255, 0, 0.05) 75%, rgba(0, 255, 0, 0.05) 76%, transparent 77%, transparent)
          `,
          backgroundSize: '50px 50px',
          fontFamily: 'monospace',
          color: '#00ff00',
        }}
      >
        {/* Terminal Header */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            fontSize: '24px',
            color: '#ff0000',
          }}
        >
          $ ./portfolio.sh
        </div>

        {/* Main Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {/* Name */}
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              marginBottom: '20px',
              textShadow: '0 0 10px #00ff00',
              letterSpacing: '-2px',
            }}
          >
            <span style={{ color: '#ff0000' }}>MIJAT</span>
            <span style={{ color: '#00ff00' }}> GOLOVCEVAC</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '32px',
              marginBottom: '30px',
              color: '#00ff00',
              opacity: 0.8,
            }}
          >
            Creative Engineer & Full-Stack Developer
          </div>

          {/* Terminal Command */}
          <div
            style={{
              fontSize: '24px',
              padding: '20px 40px',
              border: '2px solid #00ff00',
              borderRadius: '8px',
              backgroundColor: 'rgba(0, 255, 0, 0.05)',
              marginBottom: '40px',
            }}
          >
            <span style={{ color: '#ff0000' }}>$</span> CREATE DESIGN DEVELOP
          </div>

          {/* Skills */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              fontSize: '20px',
              color: '#00ff00',
              opacity: 0.7,
            }}
          >
            <span>Next.js</span>
            <span>React</span>
            <span>TypeScript</span>
            <span>Tailwind</span>
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            fontSize: '20px',
            color: '#00ff00',
            opacity: 0.6,
          }}
        >
          mijatgolovcevac.com
        </div>

        {/* Blinking Cursor */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '40px',
            fontSize: '24px',
            color: '#00ff00',
            animation: 'blink 1s infinite',
          }}
        >
          _
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
