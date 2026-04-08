import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default function TwitterImage() {
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
        {/* Twitter Bird Icon (Simplified) */}
        <div
          style={{
            position: 'absolute',
            top: '40px',
            left: '40px',
            fontSize: '32px',
            color: '#1DA1F2',
          }}
        >
          @mijat_golocevac
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
              fontSize: '72px',
              fontWeight: 'bold',
              marginBottom: '20px',
              textShadow: '0 0 10px #00ff00',
              letterSpacing: '-2px',
            }}
          >
            <span style={{ color: '#ff0000' }}>MIJAT</span>
            <span style={{ color: '#00ff00' }}> GOLOČEVAC</span>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: '28px',
              marginBottom: '30px',
              color: '#00ff00',
              opacity: 0.8,
            }}
          >
            19-yo Serbian Developer
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
            <span style={{ color: '#ff0000' }}>$</span> Crafting perfection in every pixel
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
            <span>UI/UX</span>
          </div>
        </div>

        {/* Call to Action */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            right: '40px',
            fontSize: '20px',
            padding: '10px 20px',
            border: '2px solid #1DA1F2',
            borderRadius: '8px',
            color: '#1DA1F2',
          }}
        >
          mijat.dev
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
