import React from 'react';
import { BrowserView, MobileView } from 'react-device-detect';

function Converter() {

  return(
    <div>
      { /* web */ }
      <BrowserView>
        <iframe
          src='https://n2orca.netlify.app'
          width='1280'
          height='1200'
        >
      </iframe>
      </BrowserView>
      { /* mobile */ }
      <MobileView>
        {/* redirect to 'https://n2orca.netlify.app'; */}
        <About />
      </MobileView>
    </div>
  )
}

function About() {
  // 👇️ redirect to external URL
  window.location.replace('https://n2orca.netlify.app');

  return null;
}

export default Converter;