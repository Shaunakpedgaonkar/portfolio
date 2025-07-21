  import React, { useEffect, useRef, useState } from 'react';
  import { useForm, ValidationError } from '@formspree/react';
  import Lottie from 'lottie-react';
  import planeAnimation from '../assets/paperPlane.json';
  import './Contact.css';

  const Contact = () => {
    const vantaRef = useRef(null);
    const [vantaEffect, setVantaEffect] = useState(null);
    const [state, handleSubmit] = useForm("xzzgdryp"); // Your Formspree ID

    useEffect(() => {
      if (!vantaEffect && window.VANTA?.WAVES) {
        setVantaEffect(
          window.VANTA.WAVES({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x0,
            shininess: 72.00,
            waveHeight: 28.50,
            zoom: 0.65
          })
        );
      }

      return () => {
        if (vantaEffect) vantaEffect.destroy();
      };
    }, [vantaEffect]);

    return (
      <div className="contact-section" ref={vantaRef}>
        <div className="contact-content">
          {!state.succeeded ? (
            <>
              <h2>Lets Connect</h2>
              <form className="contact-form" onSubmit={handleSubmit}>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                />

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                />
                <ValidationError prefix="Email" field="email" errors={state.errors} />

                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  placeholder="Your Message"
                  required
                />
                <ValidationError prefix="Message" field="message" errors={state.errors} />

                <button type="submit" disabled={state.submitting}>
                  Send Message 
                </button>
              </form>

              <a href="Shaunak_Pedgaonkar_Toast_Software_Engineer" download className="resume-download">
                Download Resume  
              </a>
              <p className="contact-phone"> Ph. No. +353 894948113</p>
              </>


            ) : (
            <div className="lottie-wrapper">
              <Lottie animationData={planeAnimation} loop={false} />
              <p className="thank-you-text">Message Sent!</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default Contact;
