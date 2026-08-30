import Script from "next/script"

const tidioPublicKey = process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY?.trim()
const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID?.trim()

export function IntegrationScripts() {
  return (
    <>
      {tidioPublicKey ? (
        <Script
          id="tidio-widget"
          src={`https://code.tidio.co/${tidioPublicKey}.js`}
          strategy="afterInteractive"
        />
      ) : null}

      {metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
            n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  )
}
